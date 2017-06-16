#!/usr/bin/env bash
set -e

if [[ $# -eq 0 ]] ; then
    echo "Please provide a port to listen on"
    exit -1
fi

port=$1
echo "Will listen on port $port"
sed "s/_PORT_/$port/g" /etc/nginx/conf.d/montagu.conf.template > /etc/nginx/conf.d/montagu.conf

root="/etc/montagu/proxy"
mkdir -p $root

a="$root/certificate.pem"
b="$root/ssl_key.pem"

echo "Waiting for SSL certificate files at:"
echo "- $a"
echo "- $b"

while [ ! -e $a ]
do
    sleep 2
done

while [ ! -e $b ]
do
    sleep 2
done

echo "Certificate files detected. Running nginx"
exec nginx -g "daemon off;"
