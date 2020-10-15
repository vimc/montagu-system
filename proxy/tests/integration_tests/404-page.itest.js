const webDriver = require("selenium-webdriver");
const TestHelper = require('./test-helper.js');

const browser = TestHelper.getBrowser();

beforeEach(async () => {
    await TestHelper.ensureLoggedOut(browser);
});

test('Shows 404 page for unknown urls', async () => {
    await TestHelper.ensureLoggedIn(browser);

    browser.get("https://localhost/blah");
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/blah";
        });
    });
    const header = browser.findElement(webDriver.By.css("#content h1"));
    expect(await header.getText()).toBe("Page not found");

});

test('Link in 404 page returns to index', async () => {

    browser.get("http://localhost/blah");
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/blah";
        });
    });
    const link = browser.findElement(webDriver.By.css("#content a"));
    link.click();
    await browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
            return url === "https://localhost/";
        });
    });
});