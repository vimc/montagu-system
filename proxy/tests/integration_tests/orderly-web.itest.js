const webDriver = require("selenium-webdriver");
const TestHelper = require('./test-helper.js');

const browser = TestHelper.getBrowser();

beforeEach(async () => {
    await TestHelper.ensureLoggedOut(browser);
});

test('can access orderly web', async () => {

    browser.get("https://localhost/reports/");

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url.indexOf("?redirectTo=") > -1;
        });
    });

    const emailField = await browser.findElement(webDriver.By.id("email-input"));
    const pwField = await browser.findElement(webDriver.By.id("password-input"));

    await emailField.sendKeys("test.user@example.com");
    await pwField.sendKeys("password");

    await browser.findElement(webDriver.By.id("login-button"))
        .click();

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url.indexOf("https://localhost/reports") > -1;
        });
    });

    const title = await browser.findElement(webDriver.By.className("site-title"));
    expect(await title.getText()).toBe("Reporting portal")
}, 8000);

test('old report page urls are redirected', async () => {

    browser.get("https://localhost/reports/r1/20170516-134824-a16bab9d");

    await TestHelper.ensureLoggedIn(browser);
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/reports/report/r1/20170516-134824-a16bab9d";
        });
    });

    expect(await browser.getCurrentUrl()).toBe("https://localhost/reports/report/r1/20170516-134824-a16bab9d")

}, 8000);
