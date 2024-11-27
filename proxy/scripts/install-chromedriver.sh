#!/usr/bin/env bash

set -eu

VERSION=$(google-chrome --product-version)

wget https://storage.googleapis.com/chrome-for-testing-public/$VERSION/linux64/chromedriver-linux64.zip
unzip -j -d /usr/bin chromedriver-linux64.zip chromedriver-linux64/chromedriver

chown root:root /usr/bin/chromedriver
chmod +x /usr/bin/chromedriver
