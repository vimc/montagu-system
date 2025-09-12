const MontaguUtils = require("../resources/js/montagu-utils.js")

test('can retrieve query parameter', () => {

    let paramName = "redirectTo";
    let result = MontaguUtils.paramFromQueryString("?redirectTo=somewhere", paramName);
    expect(result).toBe("somewhere");

    result = MontaguUtils.paramFromQueryString("?q1=whatever&redirectTo=somewhere", paramName);
    expect(result).toBe("somewhere");

    result = MontaguUtils.paramFromQueryString("?redirectTo=somewhere&q2=5678", paramName);
    expect(result).toBe("somewhere");

    result = MontaguUtils.paramFromQueryString("redirectTo=somewhere", paramName);
    expect(result).toBe("somewhere");

    result = MontaguUtils.paramFromQueryString("?random=somewhere", paramName);
    expect(!result).toBe(true);

    result = MontaguUtils.paramFromQueryString("?", paramName);
    expect(!result).toBe(true);

    result = MontaguUtils.paramFromQueryString("", paramName);
    expect(!result).toBe(true);

    result = MontaguUtils.paramFromQueryString(null, paramName);
    expect(!result).toBe(true);

    result = MontaguUtils.paramFromQueryString("redirectTo=someone@somewhere.com", paramName);
    expect(result).toBe("someone@somewhere.com");

    //test can uri decode
    result = MontaguUtils.paramFromQueryString("redirectTo=h%40llo%26goodbye%2F", paramName);
    expect(result).toBe("h@llo&goodbye/");

});

test('can get packit api root', () => {
    expect(MontaguUtils.getPackitApiRoot()).toBe("/packit/api/");
});

test("can tell if url is packit url", () => {
    expect(MontaguUtils.isPackitUrl("/packit")).toBe(true);
    expect(MontaguUtils.isPackitUrl("/packit/someresource/123")).toBe(true);
    expect(MontaguUtils.isPackitUrl("https://somedomain.com/packit")).toBe(true);
    expect(MontaguUtils.isPackitUrl("https://somedomain.com/packit/someresource/123")).toBe(true);

    expect(MontaguUtils.isPackitUrl("/")).toBe(false);
    expect(MontaguUtils.isPackitUrl("/anotherroute")).toBe(false);
    expect(MontaguUtils.isPackitUrl("/anotherroute/packit")).toBe(false);
    expect(MontaguUtils.isPackitUrl("https://somedomain.com")).toBe(false);
    expect(MontaguUtils.isPackitUrl("https://somedomain.com/anotherroute")).toBe(false);
    expect(MontaguUtils.isPackitUrl("https://somedomain.com/anotherroute/packit")).toBe(false);
});