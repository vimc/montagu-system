const webDriver = require("selenium-webdriver");
const TestHelper = require('./test-helper.js');

const browser = TestHelper.getBrowser();

beforeEach(async () => {
    await TestHelper.ensureLoggedOut(browser);
});

test('can access packit', async () => {
    browser.get("https://localhost/packit/");
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url.indexOf("redirectTo=") > -1;
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
            return url.indexOf("https://localhost/packit") > -1;
        });
    });

    const title = await browser.findElement(webDriver.By.className("text-xl"));
    expect(await title.getText()).toBe("Packit");
}, 8000);

test('redirects to requested packit page on login', async () => {
    const packetUrl = "https://localhost/packit/runner";
    await browser.get(packetUrl);
    await TestHelper.doLogin(browser);

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === packetUrl;
        });
    });

    const header = await browser.findElement(webDriver.By.css("h2"));
    expect(await header.getText()).toBe("Run");
    const app = await browser.findElement(webDriver.By.css(".app"));
    expect(await app.getText()).toMatch(/Run a packet group to create a new packet/);
});

test('logging out from admin portal also logs out from packit', async () => {
    // Adding some longer timeouts in this test as it can take a while to run..

    await TestHelper.ensureLoggedIn(browser);
    browser.get("https://localhost/admin/");

    // Make sure we're on the admin site then log out
    const header = await browser.findElement(webDriver.By.css(".header"));
    expect(await header.getText()).toMatch(/Admin portal/);

    const logoutLink = browser.wait(webDriver.until.elementLocated(webDriver.By.css(".logout a")), 10 * 1000);
    await logoutLink.click();

    // see index page
    const packitButton = browser.wait(webDriver.until.elementLocated(webDriver.By.id("packit-button")), 10 * 1000);

    // click Packit button - should get redirected back to index page, with redirectTo set
    await packitButton.click();

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/?loggingOut=1&redirectTo=packit/redirect";
        });
    });
}, 30 * 1000);

test('old report page urls are redirected', async () => {
    await browser.get("https://localhost");
    await TestHelper.ensureLoggedIn(browser);
    await browser.get("https://localhost/reports/r1/20170516-134824-a16bab9d");

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/packit/r1/20170516-134824-a16bab9d";
        });
    });

    expect(await browser.getCurrentUrl()).toBe("https://localhost/packit/r1/20170516-134824-a16bab9d");

});
