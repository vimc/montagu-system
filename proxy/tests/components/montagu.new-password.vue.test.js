const VueTestUtils = require("@vue/test-utils");
require("../../node_modules/vue/dist/vue.js");
const MontaguNewPassword = require("../../resources/js/components/montagu-new-password.vue.js");

test('has expected properties', () => {
    expect(MontaguNewPassword.props.length).toBe(3);
    expect(MontaguNewPassword.props[0]).toBe("tokenIsValid");
    expect(MontaguNewPassword.props[1]).toBe("setPasswordSuccess");
    expect(MontaguNewPassword.props[2]).toBe("setPasswordError");
});

test('renders correctly when password has not been set', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {tokenIsValid: true, setPasswordSuccess: false, setPasswordError: ''}});

    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#update-button').text()).toBe('Update');
    expect(wrapper.find('#set-password-error').text()).toBe('');

    expect(wrapper.find('#set-password-success').exists()).toBe(false);
    expect(wrapper.find('#token-invalid').exists()).toBe(false);
});


test('renders correctly when password has been set successfuly', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {tokenIsValid: true, setPasswordSuccess: true, setPasswordError: ''}});

    expect(wrapper.find('#password-input').exists()).toBe(false);
    expect(wrapper.find('#update-button').exists()).toBe(false);
    expect(wrapper.find('#set-password-error').exists()).toBe(false);

    expect(wrapper.find('#set-password-success').text()).toBe('Thank you, your password has been updated. Click here to return to Montagu.');
    expect(wrapper.find('#set-password-success-link').attributes()["href"]).toBe('/');

    expect(wrapper.find('#token-invalid').exists()).toBe(false);
});

test('renders correctly with set password error', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {tokenIsValid: true, setPasswordSuccess: false, setPasswordError: 'An error occurred'}});

    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#update-button').text()).toBe('Update');
    expect(wrapper.find('#set-password-error').text()).toBe('An error occurred');

    expect(wrapper.find('#set-password-success').exists()).toBe(false);

    expect(wrapper.find('#token-invalid').exists()).toBe(false);
});

test('renders correctly when token is invalid', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {tokenIsValid: false, setPasswordSuccess: false, setPasswordError: ''}});

    expect(wrapper.find('#password-input').exists()).toBe(false);
    expect(wrapper.find('#update-button').exists()).toBe(false);
    expect(wrapper.find('#set-password-error').exists()).toBe(false);
    expect(wrapper.find('#set-password-success').exists()).toBe(false);

    expect(wrapper.find('#token-invalid').exists()).toBe(true);
    expect(wrapper.find('#token-invalid-text').text()).toBe("This password reset link has expired. Please request a new one.");
    expect(wrapper.find('#request-new-reset-link-button').text()).toBe("Request new reset password link");
    expect(wrapper.find('#request-new-reset-link-button').attributes()["href"]).toBe('reset-password.html');
});

test('emits update password event when form submitted', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {tokenIsValid: true, setPasswordSuccess: false, setPasswordError: ''}});

    //set password value
    const input = wrapper.find('#password-input');
    input.element.value = "mypassword";
    input.trigger('input'); //update model

    wrapper.find("form").trigger("submit");

    expect(wrapper.emitted('update-password')).toBeTruthy();
    expect(wrapper.emitted('update-password')[0][0]).toBe('mypassword');
});
