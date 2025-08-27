const TestHelper = require("./test-helper");
test("can access packit api metrics", async () => {
    const response = await TestHelper.apiFetch(`/packit-api/metrics`, {});
    expect(response.status).toBe(200);
    expect(await response.text()).toMatch(/jvm_info/);
});

test("can access outpack server metrics", async () => {
    const response = await TestHelper.apiFetch(`/outpack_server/metrics`, {});
    expect(response.status).toBe(200);
    expect(await response.text()).toMatch(/http_requests_duration_seconds_bucket/);
});