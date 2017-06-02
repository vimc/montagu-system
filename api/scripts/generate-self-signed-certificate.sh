#!/usr/bin/env bash
set -e

if [ -z ${1+x} ] ; then
    interactive=true
else
    interactive=false
fi

if [ "$interactive" = true ] ; then
    read -s -p "Enter new password: " password
    echo ""
else
    password=$1
fi

keytool -genkeypair \
    -dname "CN=vaccineimpact.org, OU=Montagu, O=Vacinne Impact Modelling Consortium, L=London, C=GB" \
    -keyalg RSA \
    -alias api \
    -keystore keystore \
    -validity 365 \
    -keysize 2048 \
    -storepass $password \
    -keypass $password

if [ "$interactive" = true ] ; then
    echo ""
    echo "Wrote self-signed certificate to ./keystore."
    echo "Suggested next action:"
    echo "sudo mv ./keystore /etc/montagu/api/keystore"
else
    cat keystore
fi