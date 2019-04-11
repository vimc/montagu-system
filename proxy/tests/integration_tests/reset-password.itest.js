const webDriver = require("selenium-webdriver");
const TestHelper = require('./test-helper.js');

const browser = TestHelper.getBrowser();


beforeEach(async () => {

    //avoid dir bloat
    TestHelper.ensureEmptyMontaguEmailsDirExists();
});

test('can submit request reset password link', async () => {

    browser.get("https://localhost/reset-password?email=test.user@example.com");

    //Expect email input to have been populated
    const emailInput = await browser.findElement(webDriver.By.id("email-input"));
    const emailInputText = await emailInput.getAttribute("value");
    expect(emailInputText).toBe("test.user@example.com");

    await browser.findElement(webDriver.By.id("request-button"))
        .click();

    const acknowledgement = browser.wait(webDriver.until.elementLocated(webDriver.By.id('show-acknowledgement-text')));
    const ackText = await acknowledgement.getText()
    expect(ackText).toBe("Thank you. If we have an account registered for this email address you will receive a reset password link.");

});

test('can prevent submit request reset password link if no email value', async () => {

    browser.get("https://localhost/reset-password?email=");

    await browser.findElement(webDriver.By.id("request-button"))
        .click();

    //Check that acknowledgement does not appear
    await browser.sleep(3000);
    browser.findElement(webDriver.By.id('show-acknowledgement-text')).then(
        () => { expect("Should have not submitted form when no email set").toBe(""); /*we shouldn't get here*/ },
        () => { /* not found */ }
    );

    //Expect input validation to have failed
    await browser.findElement(webDriver.By.css("input:required"));
});

test('can prevent submit request reset password link invalid email value', async () => {

    browser.get("https://localhost/reset-password?email=");

    const emailInput = await browser.findElement(webDriver.By.id("email-input"));
    await emailInput.sendKeys("an invalid email address");

    await browser.findElement(webDriver.By.id("request-button"))
        .click();

    //Check that acknowledgement does not appear
    await browser.sleep(3000);
    browser.findElement(webDriver.By.id('show-acknowledgement-text')).then(
        () => { expect("Should have not submitted form when invalid email set").toBe(""); /*we shouldn't get here*/ },
        () => { /* not found */ }
    );

    //Expect input validation to have failed
    await browser.findElement(webDriver.By.css("input:invalid"));
});

test('submit request for reset password link generates token and email from API', async () => {
    const token = await TestHelper.submitResetPasswordRequestAndReadLinkToken(browser);
    expect(token.length).toBeGreaterThan(0);
});