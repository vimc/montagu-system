#!/usr/bin/env bash
set -e

root="/etc/montagu/webapps"
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
nginx -g "daemon off;"