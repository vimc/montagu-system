FROM node:24

RUN apt-get update && apt-get install -yq \
                fonts-liberation \
                libasound2 \
                libatk-bridge2.0-0 \
                libatk1.0-0 \
                libatspi2.0-0 \
                libcups2 \
                libdrm2 \
                libgbm1 \
                libgtk-3-0 \
                libnspr4 \
                libnss3 \
                libvulkan1 \
                libxcomposite1 \
                libxdamage1 \
                libxfixes3 \
                libxkbcommon0 \
                libxrandr2 \
                xdg-utils

# Pick the version from https://googlechromelabs.github.io/chrome-for-testing/
ARG CHROME_VERSION="131.0.6778.85"

RUN wget https://storage.googleapis.com/chrome-for-testing-public/$CHROME_VERSION/linux64/chrome-linux64.zip
RUN wget https://storage.googleapis.com/chrome-for-testing-public/$CHROME_VERSION/linux64/chromedriver-linux64.zip

RUN unzip -d /opt chrome-linux64.zip
RUN unzip -d /opt chromedriver-linux64.zip

ENV PATH="/opt/chrome-linux64:/opt/chromedriver-linux64:$PATH"

WORKDIR /workspace
COPY . /workspace

RUN npm install
CMD npm run integration-test
