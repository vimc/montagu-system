const webDriver = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const emailsDir = "/tmp/montagu_emails";

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

    submitResetPasswordRequestAndReadLinkToken: async function(browser) {

        const start  = Date.now();
        //console.log(start);

        //Browse to the submit request link page and make a new request
        browser.get("https://localhost/reset-password?email=passwordtest.user@example.com");
        await browser.findElement(webDriver.By.id("request-button"))
            .click();
        await browser.wait(webDriver.until.elementLocated(webDriver.By.id('show-acknowledgement-text')));

        //Read files and expect to find a new one
        const files = fs.readdirSync(emailsDir);
        files.sort();

        const latestFile = files[files.length-1];
        //console.log(latestFile);
        //console.log(files.length);

        const fileWriteTime = Date.parse(latestFile);
        //console.log(fileWriteTime);

        //Expect new file to have appeared
        expect(fileWriteTime > start).toBe(true);

        //Read the contents of the file
        const emailContent = fs.readFileSync(path.join(emailsDir, latestFile), 'utf-8');
        //console.log(emailContent);

        //Extract the token from the email content
        const regex = /\?token=(.*)/; //gets the token in the link up, to the line terminator
        const match = emailContent.match(regex);
        const token = match[1];
        //console.log(token);
        return token;
    },

     ensureLoggedOut: async function(browser) {
        await browser.get("https://localhost");

        const logout = await browser.findElements(webDriver.By.id("logout-button"));
        if (logout.length > 0) {
            await logout[0].click();
        }
    }
};

module.exports = TestHelper;