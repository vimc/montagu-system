const TestHelper = require("./test-helper");

test("can access packit api metrics", async () => {
    const response = await TestHelper.metricsFetch("/metrics/packit-api");
    expect(response.status).toBe(200);
    expect(await response.text()).toMatch(/jvm_info/);
});

test("can access outpack server metrics", async () => {
    const response = await TestHelper.metricsFetch("/metrics/outpack_server");
    expect(response.status).toBe(200);
    expect(await response.text()).toMatch(/http_requests_duration_seconds_bucket/);
});