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

test('redirects to requested packit resource on login', async () => {
    const packetUrl = "https://localhost/packit/parameters/20250122-105917-077d041a";
    await browser.get(packetUrl);
    await TestHelper.doLogin(browser);

    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === packetUrl;
        });
    });

    const header = await browser.findElement(webDriver.By.css("h2"));
    expect(await header.getText()).toBe("parameters");
    // check packet id is in page content somewhere as there's no semantically obvious selector
    const app = await browser.findElement(webDriver.By.css(".app"));
    expect(await app.getText()).toMatch(/20250122-105917-077d041a/);
});
