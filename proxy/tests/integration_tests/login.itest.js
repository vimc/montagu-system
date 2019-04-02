const webDriver = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--headless");
options.addArguments("--no-sandbox");
options.addArguments('--disable-gpu');
options.addArguments("window-size=1024,768");

const browser = new webDriver.Builder()
    .withCapabilities(webDriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build();


test('can get error message on failed login', async () => {

    browser.get("https://localhost");

    await browser.findElement(webDriver.By.id("login-button"))
        .click();
    const errorAlert = await browser.findElement(webDriver.By.id("login-error"));
    await browser.wait(webDriver.until.elementIsVisible(errorAlert),100);
    const errorMessage = await errorAlert.getText();
    expect(errorMessage).toBe("Your email address or password is incorrect.");

});
