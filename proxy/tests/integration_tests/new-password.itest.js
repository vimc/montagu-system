const webDriver = require("selenium-webdriver");
const TestHelper = require('./test-helper.js');

const browser = TestHelper.getBrowser();

beforeEach(async () => {
    await TestHelper.ensureLoggedOut(browser);
});

afterEach(async () => {
    TestHelper.ensureEmptyMontaguEmailsDirExists();
});

test('can display message when token is expired', async () => {

    const oldToken = "H4sIAAAAAAAAAJ1UXXOiShD9RdniY9XwiBoQVKIgM8CLxcwoIAMiCjj8-m2yH3WzNzex7hvV9Jw-p093H4SdEpNmr5nt-b0lO5mtfTsIu2fYGoKcYDldlbZMVYcTs8tWM7uLAvsWB04fY62hwhpbWUVXipOSTL4ShVUk6y7BTDsRFTVsYVdRsG5ogdJo9jsecVoYZeSNRISNfGXKbWSiKzF5Ewm5pIUm03llb4W8CAO7jxU04LesQCLEjAMfHuLtlWAtj_D9GuNRucJMQL3ulUf2zncez8_5fOWzlJZOHaGujQJHikEzM1H_WB3UM5PfwsDlVPzSM6s-jj-k84N3AWqigjfQ83P0f_g88v7TPjARA95_8MeeL8_BV05VtyLYkAa_mWpXzPQfqvVRzhc9-13zRhQX5vJekYLeItVuWTD949uSf4H95tNP_Hcx1QYt05aUThUW_Ara_zHD9w9q6mPPX99cxRBUuXHgJaB_HVFGsCN2Bdyhlw_O06e13_anDxXUwLxURH0XlwDnFC8cCeoO3nfwr4M8_lOT2zLsnMGjlhRfcPnLHxY4nJaf60c5d7by37lvvGSqIPGv_pqaYIt3ecADvFDtlJppFf7RZl2t0m4JzKF1OmeDp281sl9vggi4aHCTrAdnDd1CuAtfzRVwyQBzuHcVVdfDLVRC7JwAm8NedPAtrQrwWQz83BZ2twlUd0RNf8jd7HLkA5ZhZR3gpB1wvzs7X3qd6916F34H3AZ8OkUe3M8y7alpRxQn_S7f9lvp7lNscK881464qcg0NujE-tdFri6VdOmWLEU9R36vawM-C-zr0BvgraxBIzWNnqqspYULvXY4M7rWKqVv967o95mk17luPgfCBAvOSVAkJp3M53K2-S7XTabJvuJZlrpO9pdRkuuXrrS0GSH6qNslOX6un68CO8sZ9redMj6anrs-TdvV664e8TovEyMoZvTcH0f2zpmIp8o4Z5HE17rjSdpLnfgNuixOZI_M-nR78eupPr_dC0vEibl5WqbdOUyO6RJ6vZ9oSSaeL9JWH4skCkel02-4r0_O9LA3XnCXcfeuVeGkXqq72cV58khTbYpjMs4Px819hPN8MdnKdTmd1k1cPluuch0vyNqN5yl289kdTclBXa6Lqj72NvleeQdpvnyx1PhSysemDfb9wtKt4kK7BEl5HamcLlHnhatA6Uu2DFZbecE0c_sDBcRWFUMHAAA";
    await browser.get("https://localhost/new-password?token=" + oldToken);

    //Expect expired message and 'request new token' button to be displayed
    await browser.findElement(webDriver.By.id("token-invalid-text"));
    await browser.findElement(webDriver.By.id("request-new-reset-link-button"));

});

test('can prevent update password request if password not entered', async () => {

    //change password and then change it back again
    const token = await TestHelper.submitResetPasswordRequestAndReadLinkToken(browser);

    browser.get("https://localhost/new-password?token=" + token);
    await browser.findElement(webDriver.By.id("update-button"))
        .click();

    //Expect input validation to have failed
    await browser.findElement(webDriver.By.css("input:required"));

});

test('can prevent update password request if invalid password entered', async () => {

    //change password and then change it back again
    const token = await TestHelper.submitResetPasswordRequestAndReadLinkToken(browser);

    browser.get("https://localhost/new-password?token=" + token);

    //Min length is 8
    const passwordInput = await browser.findElement(webDriver.By.id("password-input"));
    await passwordInput.sendKeys("1234567");

    await browser.findElement(webDriver.By.id("update-button"))
        .click();

    //Expect input validation to have failed
    await browser.findElement(webDriver.By.css("input:invalid"));

});

test('can submit and use new password', async () => {

    //change password and then change it back again
    const token = await TestHelper.submitResetPasswordRequestAndReadLinkToken(browser);
    await changePasswordAndTestLogin(token, "newpassword");
    
});

async function changePasswordAndTestLogin(token, password) {
    //set password
    browser.get("https://localhost/new-password?token=" + token);
    await browser.wait(webDriver.until.elementLocated(webDriver.By.id('password-input')));
    const passwordInput = browser.findElement(webDriver.By.id("password-input"));
    await passwordInput.sendKeys(password);
    await browser.findElement(webDriver.By.id("update-button"))
        .click();

    await browser.wait(webDriver.until.elementLocated(webDriver.By.id('set-password-success')));

    //Now try logging in
    browser.get("https://localhost");
    await browser.wait(webDriver.until.elementLocated(webDriver.By.id('password-input')));
    const emailField = await browser.findElement(webDriver.By.id("email-input"));
    const pwField = await browser.findElement(webDriver.By.id("password-input"));

    await emailField.sendKeys("passwordtest.user@example.com");
    await pwField.sendKeys(password);

    await browser.findElement(webDriver.By.id("login-button"))
        .click();

    const loggedInBox = browser.wait(webDriver.until.elementLocated(webDriver.By.id('login-status')));

    const username = await loggedInBox.getText();
    expect(username).toBe("Logged in as passwordtest.user | Log out");

}