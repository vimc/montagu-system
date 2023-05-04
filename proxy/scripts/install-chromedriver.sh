#!/usr/bin/env bash

apt-get update
apt-get install -y unzip xvfb libxi6 libgconf-2-4

wget https://chromedriver.storage.googleapis.com/113.0.5672.63/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
mv chromedriver /usr/bin/chromedriver
chown root:root /usr/bin/chromedriver
chmod +x /usr/bin/chromedriver
