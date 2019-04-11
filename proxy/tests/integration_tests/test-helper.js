const webDriver = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');

const TestHelper =  {
    getBrowser: function() {
        const options = new chrome.Options();
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments('--disable-gpu');

        return new webDriver.Builder()
            .withCapabilities(webDriver.Capabilities.chrome())
            .setChromeOptions(options)
            .build();
    }
}

module.exports = TestHelper;