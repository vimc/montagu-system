FROM node:16-buster

RUN apt-get update && apt-get install -yq \
                default-jre \
                gconf-service \
                libasound2 \
                libatk1.0-0 \
                libatk-bridge2.0-0 \
                libc6 \
                libcairo2 \
                libcups2 \
                libdbus-1-3 \
                libdrm2 \
                libexpat1 \
                libfontconfig1 \
                libgcc1 \
                libgconf-2-4 \
                libgdk-pixbuf2.0-0 \
                libglib2.0-0 \
                libgtk-3-0 \
                libgbm1 \
                libnspr4 \
                libpango-1.0-0 \
                libpangocairo-1.0-0 \
                libstdc++6 \
                libx11-6 \
                libx11-xcb1 \
                libxcb1 \
                libxcomposite1 \
                libxcursor1 \
                libxdamage1 \
                libxext6 \
                libxfixes3 \
                libxi6 \
                libxrandr2 \
                libxrender1 \
                libxss1 \
                libxtst6 \
                libu2f-udev \
                libvulkan1 \
                ca-certificates \
                fonts-liberation \
                libappindicator1 \
                libnss3 \
                lsb-release \
                xdg-utils \
                wget

# Pick the version from https://googlechromelabs.github.io/chrome-for-testing/
ARG CHROME_VERSION="131.0.6778.85"

RUN ./scripts/install-chromedriver.sh

WORKDIR /workspace
COPY . /workspace

RUN npm install
CMD npm run integration-test
