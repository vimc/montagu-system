const VueTestUtils = require("@vue/test-utils");
require("../../node_modules/vue/dist/vue.js");
const MontaguNewPassword = require("../../resources/js/components/montagu-new-password.vue.js");

test('has expected properties', () => {
    expect(MontaguNewPassword.props.length).toBe(2);
    expect(MontaguNewPassword.props[0]).toBe("setPasswordSuccess");
    expect(MontaguNewPassword.props[1]).toBe("setPasswordError");
});