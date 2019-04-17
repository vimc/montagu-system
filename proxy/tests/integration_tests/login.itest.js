const webDriver = require("selenium-webdriver");
const TestHelper = require('./test-helper.js');

const browser = TestHelper.getBrowser();

beforeEach(async () => {
    await TestHelper.ensureLoggedOut(browser);
});


test('is logged in if cookie is present', async () => {

    TestHelper.ensureLoggedIn(browser);

    // navigate away
    browser.get("https://google.com");

    //navigate back
    browser.get("https://localhost");

    const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

    const username = await loggedInBox.getText();
    expect(username).toBe("Logged in as test.user | Log out");

});

test('can get error message on failed login', async () => {

    browser.get("https://localhost");

    await browser.findElement(webDriver.By.id("login-button"))
        .click();

    const errorAlert = await browser.findElement(webDriver.By.id("login-error"));

    await browser.wait(() => {
        return errorAlert.getText().then((text) => {
            return text === "Your email address or password is incorrect.";
        });
    });

    const errorMessage = await errorAlert.getText();
    expect(errorMessage).toBe("Your email address or password is incorrect.");

});

test('can login without redirect', async () => {

    TestHelper.ensureLoggedIn(browser);

    const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

    const username = await loggedInBox.getText();
    expect(username).toBe("Logged in as test.user | Log out");

});

test('can login with redirect', async () => {

    browser.get("https://localhost?redirectTo=http://nonsense");

    const emailField = await browser.findElement(webDriver.By.id("email-input"));
    const pwField = await browser.findElement(webDriver.By.id("password-input"));

    await emailField.sendKeys("test.user@example.com");
    await pwField.sendKeys("password");

    await browser.findElement(webDriver.By.id("login-button"))
        .click();

    const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "http://nonsense/";
        });
    });

    expect(await browser.getCurrentUrl()).toBe("http://nonsense/");
});
