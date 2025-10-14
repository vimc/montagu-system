#!/usr/bin/env bash
set -ex

while [[ $# -gt 0 ]]; do
    case "$1" in
        --api-image)
          API_IMAGE="$2"
          shift 2
          ;;
        --db-image)
          DB_IMAGE="$2"
          shift 2
          ;;
        --proxy-image)
          PROXY_IMAGE="$2"
          shift 2
          ;;
        --task-queue-image)
          TASK_QUEUE_IMAGE="$2"
          shift 2
          ;;
        --admin-image)
          ADMIN_IMAGE="$2"
          shift 2
          ;;
        --contrib-image)
          CONTRIB_IMAGE="$2"
          shift 2
          ;;
        --migrate-image)
          MIGRATE_IMAGE="$2"
          shift 2
          ;;
        --api-config-path)
          API_CONFIG_PATH="$2"
          shift 2
          ;;
        --packit-config)
          PACKIT_CONFIG="$2"
          shift 2
          ;;
      *)
          echo "Invalid argument: $1"
          exit 1
          ;;
    esac
done

here=$(dirname $0)
. $here/common.sh

echo org is
echo $ORG

if [[ -z $API_IMAGE ]]; then
  API_IMAGE=${ORG}/montagu-api:${DEFAULT_BRANCH}
fi

if [[ -z $DB_IMAGE ]]; then
  DB_IMAGE=${ORG}/montagu-db:${DEFAULT_BRANCH}
fi

if [[ -z $PROXY_IMAGE ]]; then
  PROXY_IMAGE=${ORG}/montagu-proxy:${DEFAULT_BRANCH}
fi

if [[ -z $TASK_QUEUE_IMAGE ]]; then
  TASK_QUEUE_IMAGE=${ORG}/task-queue-worker:${DEFAULT_BRANCH}
fi

if [[ -z $ADMIN_IMAGE ]]; then
  ADMIN_IMAGE=${ORG}/montagu-admin-portal:${DEFAULT_BRANCH}
fi

if [[ -z $CONTRIB_IMAGE ]]; then
  CONTRIB_IMAGE=${ORG}/montagu-contrib-portal:${DEFAULT_BRANCH}
fi

if [[ -z $MIGRATE_IMAGE ]]; then
  MIGRATE_IMAGE=${ORG}/montagu-migrate:${DEFAULT_BRANCH}
fi

# pull dependency images - some images may be local only so ignore pull failures
API_IMAGE=$API_IMAGE \
DB_IMAGE=$DB_IMAGE \
PROXY_IMAGE=$PROXY_IMAGE \
TASK_QUEUE_IMAGE=$TASK_QUEUE_IMAGE \
ADMIN_IMAGE=$ADMIN_IMAGE \
CONTRIB_IMAGE=$CONTRIB_IMAGE \
MIGRATE_IMAGE=$MIGRATE_IMAGE \
docker compose -f $here/docker-compose.yml pull --ignore-pull-failures

# run docker
# TODO: is there a nicer way than this!
API_IMAGE=$API_IMAGE \
DB_IMAGE=$DB_IMAGE \
PROXY_IMAGE=$PROXY_IMAGE \
TASK_QUEUE_IMAGE=$TASK_QUEUE_IMAGE \
ADMIN_IMAGE=$ADMIN_IMAGE \
CONTRIB_IMAGE=$CONTRIB_IMAGE \
MIGRATE_IMAGE=$MIGRATE_IMAGE \
docker compose -f $here/docker-compose.yml --project-name montagu up -d

# Start the API
docker exec montagu-api-1 mkdir -p /etc/montagu/api/
if [[ -n $API_CONFIG_PATH ]]; then
  docker container cp $API_CONFIG_PATH montagu-api-1:/etc/montagu/api/config.properties
fi
docker exec montagu-api-1 touch /etc/montagu/api/go_signal

# Wait for the database
docker exec montagu-db-1 montagu-wait.sh 120

# Migrate the database
docker pull $MIGRATE_IMAGE || true # Pull will fail if image is local only
docker run --network=montagu_default $MIGRATE_IMAGE

# Run packit
$here/start-packit.sh $PACKIT_CONFIG