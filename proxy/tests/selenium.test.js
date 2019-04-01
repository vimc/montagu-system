const webDriver = require("selenium-webdriver");

const browser = new webDriver.Builder().withCapabilities(webDriver.Capabilities.chrome()).build();


test('can get error message on failed login', async () => {

    browser.get("https://localhost");

    await browser.findElement(webDriver.By.id("login-button"))
        .click();
    const errorAlert = await browser.findElement(webDriver.By.id("login-error"));
    await browser.wait(webDriver.until.elementIsVisible(errorAlert),100);
    const errorMessage = await errorAlert.getText();
    expect(errorMessage).toBe("Your email address or password is incorrect.");

});