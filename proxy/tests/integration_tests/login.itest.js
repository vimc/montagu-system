const webDriver = require("selenium-webdriver");
const TestHelper = require('./test-helper.js');

const browser = TestHelper.getBrowser();

beforeEach(async () => {
    await TestHelper.ensureLoggedOut(browser);
});

test('is logged in if cookie is present', async () => {

    await TestHelper.ensureLoggedIn(browser);

    // navigate away
    browser.get("https://google.com");

    //navigate back
    browser.get("https://localhost");

    const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

    const username = await loggedInBox.getText();
    expect(username).toBe("Logged in as test.user | Log out");

}, 9000);

test('is not logged in if cookie is not present', async () => {

    console.time("loggedOutTest");
    await TestHelper.ensureLoggedOut(browser);
    browser.get("https://localhost");

    const emailInput = browser.wait(webDriver.until.elementLocated(webDriver.By.id('email-input')));

    expect(await emailInput.isDisplayed()).toBe(true);

}, 7000);

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

}, 6000);

test('can login without redirect', async () => {

    await TestHelper.ensureLoggedIn(browser);

    const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

    const username = await loggedInBox.getText();
    expect(username).toBe("Logged in as test.user | Log out");

});

test('can login with redirect', async (done) => {

    browser.get("https://localhost?redirectTo=https://nonsense/");

    const emailField = await browser.findElement(webDriver.By.id("email-input"));
    const pwField = await browser.findElement(webDriver.By.id("password-input"));

    await emailField.sendKeys("test.user@example.com");
    await pwField.sendKeys("password");

    await browser.findElement(webDriver.By.id("login-button"))
        .click();

    const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

    setTimeout(async () =>  {
        expect(await browser.getCurrentUrl()).toBe("https://nonsense/");
        done();
    }, 2000);

});

test('redirects user if redirect query is present and user is already logged in', async (done) => {

    await TestHelper.ensureLoggedIn(browser);

    // navigate away
    browser.get("https://mozilla.org");

    //navigate back
    browser.get("https://localhost?redirectTo=https://www.google.com");

    setTimeout(async () =>  {
        expect(await browser.getCurrentUrl()).toBe("https://www.google.com/");
        done();
    }, 2000);
}, 9000);

test('Shows 404 page for unknown urls', async () => {
    await TestHelper.ensureLoggedIn(browser);

    browser.get("https://localhost/blah");
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/blah/";
        });
    });
    const header = browser.findElement(webDriver.By.css("h1"));
    expect(header.getText()).toBe("Page not found");

});

test('Link in 404 page returns to index', async () => {

    browser.get("http://localhost/blah");
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/blah";
        });
    });
    const link = browser.findElement(webDriver.By.css("a"));
    link.click();
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/";
        });
    });

});
