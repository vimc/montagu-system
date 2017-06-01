read -s -p "Enter new password: " password
keytool -genkeypair \
  -dname "CN=vaccineimpact.org, OU=Montagu, O=Vacinne Impact Modelling Consortium, L=London, C=GB" \
  -keyalg RSA \
  -alias api \
  -keystore keystore \
  -validity 365 \
  -keysize 2048 \
  -storepass $password \
  -keypass $password
echo ""
echo "Wrote self-signed certificate to ./keystore."
echo "Suggested next action:"
echo "sudo mv ./keystore /etc/montagu/api/keystore"