const webDriver = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const emailsDir = path.resolve(__dirname, "../../montagu_emails");

const TestHelper = {
    getBrowser: function () {
        const options = new chrome.Options();
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments('--disable-gpu');
        options.addArguments('--ignore-certificate-errors');

        return new webDriver.Builder()
            .withCapabilities(webDriver.Capabilities.chrome())
            .setChromeOptions(options)
            .build();
    },

    ensureEmptyMontaguEmailsDirExists() {
        if (!fs.existsSync(emailsDir)) {
            fs.mkdirSync(emailsDir);
        }

        const files = fs.readdirSync(emailsDir);
        for (const file of files) {
            fs.unlinkSync(path.join(emailsDir, file));
        }
    },

    submitResetPasswordRequestAndReadLinkToken: async function (browser) {

        const start = Date.now();

        //Browse to the submit request link page and make a new request
        browser.get("https://localhost/reset-password?email=passwordtest.user@example.com");
        await browser.findElement(webDriver.By.id("request-button"))
            .click();
        await browser.wait(webDriver.until.elementLocated(webDriver.By.id('show-acknowledgement-text')));

        //Read files and expect to find a new one
        const files = fs.readdirSync(emailsDir);
        files.sort();

        const latestFile = files[files.length - 1];

        const fileWriteTime = Date.parse(latestFile);

        //Expect new file to have appeared
        expect(fileWriteTime > start).toBe(true);

        //Read the contents of the file
        const emailContent = fs.readFileSync(path.join(emailsDir, latestFile), 'utf-8');

        //Extract the token from the email content
        const regex = /\?token=(.*)/; //gets the token in the link up, to the line terminator
        const match = emailContent.match(regex);
        const token = match[1];

        return token;
    },

    ensureLoggedIn: async function (browser) {
        const emailField = browser.wait(webDriver.until.elementLocated(webDriver.By.id("email-input")));
        const pwField = browser.wait(webDriver.until.elementLocated(webDriver.By.id("password-input")));

        await emailField.sendKeys("test.user@example.com");
        await pwField.sendKeys("password");

        await browser.findElement(webDriver.By.id("login-button"))
            .click();

        const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

        const username = await loggedInBox.getText();
        expect(username).not.toBe(null);
    },

    ensureLoggedOut: async function (browser) {
        await browser.get("https://localhost");

        await browser.sleep(500);
        const logout = await browser.findElements(webDriver.By.id("logout-button"));
        if (logout.length > 0) {
            await logout[0].click();
        }

        browser.wait(webDriver.until.elementLocated(webDriver.By.id("email-input")));
    }
};

module.exports = TestHelper;