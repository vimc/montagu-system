docker ps -aq | xargs -r docker stop
docker volume rm montagu_packit_db
docker container prune --force
docker volume prune --force
docker network prune --force
