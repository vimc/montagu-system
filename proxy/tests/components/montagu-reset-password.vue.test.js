const VueTestUtils = require("@vue/test-utils");

const Vue = require("../../node_modules/vue/dist/vue.js");
const MontaguResetPassword = require("../../resources/js/components/montagu-reset-password.vue.js");

test('has expected properties', () => {
    expect(MontaguResetPassword.props.length).toBe(3);
    expect(MontaguResetPassword.props[0]).toBe("email");
    expect(MontaguResetPassword.props[1]).toBe("showAcknowledgement");
    expect(MontaguResetPassword.props[2]).toBe("resetPasswordError");
});


test('renders correctly not showing acknowledgement', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {email: 'email@example.com', showAcknowledgement: false, resetPasswordError: ""}});

    expect(wrapper.find('#email-input').element.value).toBe('email@example.com');
    expect(wrapper.find('#request-button').text()).toBe('Request password reset email');
    expect(wrapper.find('#reset-password-error').text()).toBe('');

    expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(false);
});

test('renders correctly showing acknowledgement', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {email: 'email@example.com', showAcknowledgement: true, resetPasswordError: ""}});

    expect(wrapper.find('#email-input').element.value).toBe('email@example.com');
    expect(wrapper.find('#request-button').text()).toBe('Request password reset email');
    expect(wrapper.find('#reset-password-error').text()).toBe('');

    expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(true);
    expect(wrapper.find('#show-acknowledgement-text').text()).toBe("Thank you. If we have an account registered for this email address you will receive a reset password link.");
});

test('renders correctly showing reset password error', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {email: 'email@example.com', showAcknowledgement: false, resetPasswordError: "An error occurred"}});

    expect(wrapper.find('#email-input').element.value).toBe('email@example.com');
    expect(wrapper.find('#request-button').text()).toBe('Request password reset email');
    expect(wrapper.find('#reset-password-error').text()).toBe('An error occurred');

    expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(false);
});

test('emits requestLink event when form submitted', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {email: 'email@example.com', showAcknowledgement: false, resetPasswordError: ""}});

    wrapper.find("form").trigger("submit");

    expect(wrapper.emitted('request-reset-link')).toBeTruthy();
    expect(wrapper.emitted('request-reset-link')[0][0]).toBe('email@example.com');
});


