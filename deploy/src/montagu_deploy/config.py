import random
import string

import constellation
from constellation import config


class MontaguConfig:
    def __init__(self, path, extra=None, options=None):
        dat = config.read_yaml(f"{path}/montagu.yml")
        dat = config.config_build(path, dat, extra, options)
        self.vault = config.config_vault(dat, ["vault"])
        self.network = config.config_string(dat, ["network"])
        self.protect_data = config.config_boolean(dat, ["protect_data"])
        self.volumes = {
            "db": config.config_string(dat, ["volumes", "db"]),
            "emails": config.config_string(dat, ["volumes", "emails"]),
            "burden_estimates": config.config_string(dat, ["volumes", "burden_estimates"]),
            "templates": config.config_string(dat, ["volumes", "templates"]),
            "guidance": config.config_string(dat, ["volumes", "guidance"]),
            "static": config.config_string(dat, ["volumes", "static"]),
            "static_logs": config.config_string(dat, ["volumes", "static_logs"]),
        }

        self.container_prefix = config.config_string(dat, ["container_prefix"])
        self.repo = config.config_string(dat, ["repo"])
        self.hostname = config.config_string(dat, ["hostname"])
        self.orderly_web_api_url = config.config_string(dat, ["orderly_web_api_url"])

        # API
        self.api_ref = self.build_ref(dat, "api")
        self.real_emails = "email" in dat["api"]
        if self.real_emails:
            self.email_password = config.config_string(dat, ["api", "email", "password"])
            self.email_flow_url = config.config_string(dat, ["api", "email", "flow_url"])

        # DB
        self.db_ref = self.build_ref(dat, "db")
        self.db_migrate_ref = self.build_ref(dat["db"], "migrate")
        self.db_root_user = config.config_string(dat, ["db", "root_user"])
        if "root_password" in dat["db"]:
            self.db_root_password = config.config_string(dat, ["db", "root_password"])
        else:
            self.db_root_password = "".join(
                random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(50)
            )
        self.db_users = config.config_dict(dat, ["db", "users"])
        invalid = {
            k: v for k, v in self.db_users.items() if "permissions" in v and v["permissions"] not in ["all", "readonly"]
        }
        if any(invalid):
            invalid_str = ",".join(iter(invalid.keys()))
            msg = f"Invalid database permissions for '{invalid_str}'. Supported values are 'all' and 'readonly'"
            raise Exception(msg)
        self.db_protected_tables = config.config_list(dat, ["db", "protected_tables"])
        self.enable_streaming_replication = "barman" in self.db_users and "streaming_barman" in self.db_users

        # Proxy
        self.proxy_ref = self.build_ref(dat, "proxy")
        self.proxy_ssl_self_signed = "ssl" not in dat["proxy"]
        if not self.proxy_ssl_self_signed:
            self.ssl_certificate = config.config_string(dat, ["proxy", "ssl", "certificate"])
            self.ssl_key = config.config_string(dat, ["proxy", "ssl", "key"])
            self.dhparam = config.config_string(dat, ["proxy", "ssl", "dhparam"])
        self.proxy_port_http = config.config_integer(dat, ["proxy", "port_http"])
        self.proxy_port_https = config.config_integer(dat, ["proxy", "port_https"])
        self.proxy_metrics_ref = self.build_ref(dat["proxy"], "metrics")

        # Portals
        self.admin_ref = self.build_ref(dat, "admin")
        self.contrib_ref = self.build_ref(dat, "contrib")

        self.static_ref = self.build_ref(dat, "static")

        self.containers = {
            "db": "db",
            "api": "api",
            "proxy": "proxy",
            "metrics": "proxy-metrics",
            "admin": "admin",
            "contrib": "contrib",
            "static": "static",
        }

        self.images = {
            "db": self.db_ref,
            "api": self.api_ref,
            "proxy": self.proxy_ref,
            "metrics": self.proxy_metrics_ref,
            "admin": self.admin_ref,
            "contrib": self.contrib_ref,
            "static": self.static_ref,
            "db_migrate": self.db_migrate_ref,
        }

    def build_ref(self, dat, section):
        name = config.config_string(dat, [section, "name"])
        tag = config.config_string(dat, [section, "tag"])
        if "repo" in dat[section]:
            repo = config.config_string(dat, [section, "repo"])
        else:
            repo = self.repo
        return constellation.ImageReference(repo, name, tag)
