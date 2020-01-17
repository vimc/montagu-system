ORDERLY_IMAGE="vimc/orderly:master"
OW_MIGRATE_IMAGE="vimc/orderlyweb-migrate:master"
ORDERLY_WEB_IMAGE="vimc/orderly-web:master"

# create orderly db
rm  -rf -v $PWD/demo
rm  -rf -v $PWD/git

docker pull $ORDERLY_IMAGE
docker run --rm --entrypoint create_orderly_demo.sh -v "$PWD:/orderly" -u $UID -w /orderly $ORDERLY_IMAGE .

# migrate to add orderlyweb tables
docker pull $OW_MIGRATE_IMAGE
docker run --rm -v "$PWD/demo:/orderly" $OW_MIGRATE_IMAGE

# start orderlyweb
docker pull $ORDERLY_WEB_IMAGE
docker run -d -v "$PWD/demo:/orderly" -p 8888:8888 --net=host --name orderly-web $ORDERLY_WEB_IMAGE

docker exec orderly-web mkdir -p /etc/orderly/web
docker exec orderly-web touch /etc/orderly/web/go_signal

