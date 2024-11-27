#!/usr/bin/env bash
set -e

if [ "$#" -eq 2 ]; then
	port=$1
	host=$2
else
    echo "Usage: PORT HOSTNAME"
    echo "e.g. docker run ... 443 montagu.vaccineimpact.org"
    exit -1
fi

echo "Will listen on port $port with hostname $host"
sed -e "s/_PORT_/$port/g" \
	-e "s/_HOST_/$host/g" \
	/etc/nginx/conf.d/montagu.conf.template > /etc/nginx/conf.d/montagu.conf

root="/etc/montagu/proxy"
mkdir -p $root

if [[ ! -f $root/certificate.pem ]]; then
  echo "Generating self-signed certificate for $host"

  openssl req -quiet -x509 -newkey rsa:4096 \
    -sha256 -days 365 -noenc \
    -subj "/C=GB/L=Location/O=Vaccine Impact Modelling Consortium/OU=Montagu/CN=$host" \
    -keyout "$root/ssl_key.pem" -out "$root/certificate.pem"
fi

echo "Starting nginx"
exec nginx -g "daemon off;"
