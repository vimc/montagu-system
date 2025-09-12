// We test the successful case with Selenium, but here ensure that packit preauth endpoint is locked down to external
// access, and that montagu auth endpoint returns 401 with invalid token

const TestHelper = require('./test-helper.js');

test("montagu login endpoint returns 401 with invalid token", async () => {
    const response = await TestHelper.apiFetch(`/packit/api/auth/login/montagu`, {
        "Authorization": "Bearer invalid_token"
    });
    expect(response.status).toBe(401);
});

test("preauth login endpoint returns 404", async () => {
    const response = await TestHelper.apiFetch(`/packit/api/auth/login/preauth`, {
        "X-Remote-User": "test.user",
        "X-Remote-Email": "test.user@example.com",
        "X-Remote-Name": "Test User"
    });
    expect(response.status).toBe(404);
})