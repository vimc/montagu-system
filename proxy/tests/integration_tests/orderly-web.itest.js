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

/*
// TODO: REPLACE THIS WITH A TEST TO REDIRECT TO A DEMO PACKIT - REQUIRE ADD PACKIT USER SCRIPT TO HAVE BEEN CALLED
test('old report page urls are redirected', async () => {
    await browser.get("https://localhost");
    await TestHelper.ensureLoggedIn(browser);
    await browser.get("https://localhost/reports/r1/20170516-134824-a16bab9d");

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/reports/report/r1/20170516-134824-a16bab9d";
        });
    });

    expect(await browser.getCurrentUrl()).toBe("https://localhost/reports/report/r1/20170516-134824-a16bab9d")

});*/
