const VueTestUtils = require("@vue/test-utils");

const Vue = require("../../node_modules/vue/dist/vue.js");
const MontaguResetPassword = require("../../resources/js/components/montagu-reset-password.vue.js");

test('has expected properties', () => {
    expect(MontaguResetPassword.props.length).toBe(2);
    expect(MontaguResetPassword.props[0]).toBe("email");
    expect(MontaguResetPassword.props[1]).toBe("showAcknowledgement");
});
