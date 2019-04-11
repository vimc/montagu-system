const webDriver = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const util = require('util');

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

    submitResetPasswordRequestAndReadLinkToken: async function(browser) {

        const start  = Date.now();
        console.log(start);

        //Browse to the submit request link page and make a new request
        browser.get("https://localhost/reset-password?email=test.user@example.com");
        await browser.findElement(webDriver.By.id("request-button"))
            .click();
        await browser.wait(webDriver.until.elementLocated(webDriver.By.id('show-acknowledgement-text')));

        //Read files and expect to find a new one
        const readdir = util.promisify(fs.readdir);
        const emailsDir = "/tmp/montagu_emails";
        const files = await readdir(emailsDir);
        files.sort();

        const latestFile = files[files.length-1];
        console.log(latestFile);
        console.log(files.length);

        const fileWriteTime = Date.parse(latestFile);
        console.log(fileWriteTime);

        //Expect new file to have appeared
        expect(fileWriteTime > start).toBe(true);

        //Read the contents of the file
        const readfile = util.promisify(fs.readFile);
        const emailContent = await readfile(emailsDir + '/' + latestFile, 'utf-8');
        console.log(emailContent);

        //Extract the token from the email content
        const regex = /\?token=(.*)/; //gets the token in the link up, to the line terminator
        const match = emailContent.match(regex);
        const token = match[1];
        console.log(token);
        return token;
    }
};

module.exports = TestHelper;