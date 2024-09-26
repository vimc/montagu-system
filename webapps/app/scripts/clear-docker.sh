docker logs montagu-db-1

docker stop $(docker ps -aq)
docker rm $(docker ps -aq) -f
docker network prune --force

docker ps
