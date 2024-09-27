docker stop $(docker ps -aq)
docker rm $(docker ps -aq) -f
docker network prune --force
docker volume prune --force

docker ps
