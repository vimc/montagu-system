from os.path import join

import constellation
import docker
from constellation import docker_util
from psycopg2 import connect

from montagu_deploy import database


class MontaguConstellation:
    def __init__(self, cfg):
        api = api_container(cfg)
        db = db_container(cfg)
        admin = admin_container(cfg)
        contrib = contrib_container(cfg)
        static = static_container(cfg)
        proxy = proxy_container(cfg)

        containers = [api, db, admin, contrib, static, proxy]

        self.cfg = cfg
        self.obj = constellation.Constellation(
            "montagu", cfg.container_prefix, containers, cfg.network, cfg.volumes, data=cfg, vault_config=cfg.vault
        )

    def start(self, **kwargs):
        self.obj.start(**kwargs)
        # The proxy metrics container cannot be started via constellation, because
        # it has to belong to the same network as the proxy as soon as it is started
        # and constellation starts containers on the 'none' network. So we provide
        # start/stop/status methods for the metrics container that mimic the
        # constellation behaviour
        start_proxy_metrics(self.cfg)

    def stop(self, **kwargs):
        stop_proxy_metrics(self.cfg)
        self.obj.stop(**kwargs)

    def status(self):
        self.obj.status()
        status_proxy_metrics(self.cfg)


def admin_container(cfg):
    name = cfg.containers["admin"]
    return constellation.ConstellationContainer(name, cfg.admin_ref)


def contrib_container(cfg):
    name = cfg.containers["contrib"]
    mounts = [
        constellation.ConstellationMount("templates", "/usr/share/nginx/html/templates"),
        constellation.ConstellationMount("guidance", "/usr/share/nginx/html/guidance"),
    ]
    return constellation.ConstellationContainer(name, cfg.contrib_ref, mounts=mounts)


def static_container(cfg):
    name = cfg.containers["static"]
    mounts = [
        constellation.ConstellationMount("static", "/www"),
        constellation.ConstellationMount("static_logs", "/var/log/caddy"),
    ]
    return constellation.ConstellationContainer(name, cfg.static_ref, mounts=mounts)


def db_container(cfg):
    name = cfg.containers["db"]
    mounts = [constellation.ConstellationMount("db", "/pgdata")]
    return constellation.ConstellationContainer(name, cfg.db_ref, mounts=mounts, ports=[5432], configure=db_configure)


def db_configure(container, cfg):
    print("[db] Waiting for the database to accept connections")
    docker_util.exec_safely(container, ["montagu-wait.sh", "7200"])
    print("[db] Scrambling root password")
    db_set_root_password(container, cfg, cfg.db_root_password)
    print("[db] Setting up database users")
    db_setup_users(cfg)
    print("[db] Migrating database schema")
    db_migrate_schema(cfg)
    print("[db] Refreshing user permissions")
    # The migrations may have added new tables, so we should set the permissions
    # again, in case users need to have permissions on these new tables
    db_set_user_permissions(cfg)

    if cfg.enable_streaming_replication:
        print("[db] Enabling streaming replication")
        db_enable_streaming_replication(container, cfg)


def db_set_root_password(container, cfg, password):
    query = f"ALTER USER {cfg.db_root_user} WITH PASSWORD '{password}'"
    docker_util.exec_safely(container, f'psql -U {cfg.db_root_user} -d postgres -c "{query}"')


def db_setup_users(cfg):
    with db_connection(cfg) as conn:
        with conn.cursor() as cur:
            for user in cfg.db_users:
                database.setup_db_user(cur, user, cfg.db_users[user])
        conn.commit()


def db_set_user_permissions(cfg):
    with db_connection(cfg) as conn:
        with conn.cursor() as cur:
            for user in cfg.db_users:
                database.set_permissions(cur, user, cfg.db_users[user])
                # Revoke specific permissions now that all tables have been created.
                database.revoke_write_on_protected_tables(cur, user, cfg.db_protected_tables)
        conn.commit()


def db_connection(cfg):
    return connect(user=cfg.db_root_user, dbname="montagu", password=cfg.db_root_password, host="localhost", port=5432)


def db_migrate_schema(cfg):
    network_name = cfg.network
    image = cfg.db_migrate_ref
    client = docker.client.from_env()
    client.containers.run(
        str(image),
        [f"-user={cfg.db_root_user}", f"-password={cfg.db_root_password}", "migrate"],
        network=network_name,
        stderr=True,
        remove=True,
    )


def db_enable_streaming_replication(container, cfg):
    docker_util.exec_safely(
        container,
        ["enable-replication.sh", cfg.db_users["barman"]["password"], cfg.db_users["streaming_barman"]["password"]],
    )


def api_container(cfg):
    name = cfg.containers["api"]
    mounts = [
        constellation.ConstellationMount("burden_estimates", "/upload_dir"),
        constellation.ConstellationMount("emails", "/tmp/emails"),  # noqa S108
    ]
    return constellation.ConstellationContainer(name, cfg.api_ref, mounts=mounts, configure=api_configure)


def api_configure(container, cfg):
    print("[api] Configuring API container")
    docker_util.exec_safely(container, ["mkdir", "-p", "/etc/montagu/api"])
    inject_api_config(container, cfg)
    start_api(container)


def start_api(container):
    docker_util.exec_safely(container, ["touch", "/etc/montagu/api/go_signal"])


def inject_api_config(container, cfg):
    db_name = cfg.containers["db"]
    opts = {
        "app.url": f"https://{cfg.hostname}/api",
        "db.host": db_name,
        "db.username": "api",
        "db.password": cfg.db_users["api"]["password"],
        "allow.localhost": False,
        # TODO  "celery.flower.host",
        "orderlyweb.api.url": cfg.orderly_web_api_url,
        "upload.dir": "/upload_dir",
    }

    if cfg.real_emails:
        opts["email.mode"] = "real"
        opts["email.password"] = cfg.email_password
        opts["flow.url"] = cfg.email_flow_url

    txt = "".join([f"{k}={v}\n" for k, v in opts.items()])
    docker_util.string_into_container(txt, container, "/etc/montagu/api/config.properties")


def proxy_container(cfg):
    name = cfg.containers["proxy"]
    proxy_ports = [cfg.proxy_port_http, cfg.proxy_port_https]
    return constellation.ConstellationContainer(
        name,
        cfg.proxy_ref,
        ports=proxy_ports,
        args=[str(cfg.proxy_port_https), cfg.hostname],
        configure=proxy_configure,
    )


def proxy_configure(container, cfg):
    print("[proxy] Configuring reverse proxy")
    ssl_path = "/etc/montagu/proxy"
    if cfg.proxy_ssl_self_signed:
        print("[proxy] Generating self-signed certificates for proxy")
        docker_util.exec_safely(container, ["self-signed-certificate", ssl_path])
    else:
        print("[proxy] Copying ssl certificate and key into proxy")
        docker_util.exec_safely(container, f"mkdir -p {ssl_path}")
        docker_util.string_into_container(cfg.ssl_certificate, container, join(ssl_path, "certificate.pem"))
        docker_util.string_into_container(cfg.ssl_key, container, join(ssl_path, "ssl_key.pem"))
        docker_util.string_into_container(cfg.dhparam, container, join(ssl_path, "dhparam.pem"))


def start_proxy_metrics(cfg):
    name = "{}-{}".format(cfg.container_prefix, cfg.containers["metrics"])
    proxy_name = cfg.containers["proxy"]
    image = str(cfg.proxy_metrics_ref)
    print("Starting {} ({})".format(cfg.containers["metrics"], image))
    docker.from_env().containers.run(
        image,
        restart_policy={"Name": "always"},
        ports={"9113/tcp": 9113},
        command=f'-nginx.scrape-uri "http://{proxy_name}/basic_status"',
        network=cfg.network,
        name=name,
        detach=True,
    )


def stop_proxy_metrics(cfg):
    name = "{}-{}".format(cfg.container_prefix, cfg.containers["metrics"])
    container = get_container(name)
    if container:
        print(f"Killing '{name}'")
        container.remove(force=True)


def status_proxy_metrics(cfg):
    name = "{}-{}".format(cfg.container_prefix, cfg.containers["metrics"])
    container = get_container(name)
    status = container.status if container else "missing"
    print("    - {} ({}): {}".format(cfg.containers["metrics"], name, status))


def get_container(name):
    client = docker.client.from_env()
    try:
        return client.containers.get(name)
    except docker.errors.NotFound:
        return None
