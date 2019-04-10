const VueTestUtils = require("@vue/test-utils");
require("../../node_modules/vue/dist/vue.js");
const MontaguNewPassword = require("../../resources/js/components/montagu-new-password.vue.js");

test('has expected properties', () => {
    expect(MontaguNewPassword.props.length).toBe(2);
    expect(MontaguNewPassword.props[0]).toBe("setPasswordSuccess");
    expect(MontaguNewPassword.props[1]).toBe("setPasswordError");
});

test('renders correctly when password has not been set', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {setPasswordSuccess: false, setPasswordError: ''}});

    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#update-button').text()).toBe('Update');
    expect(wrapper.find('#set-password-error').text()).toBe('');

    expect(wrapper.find('#set-password-success').exists()).toBe(false);
});


test('renders correctly when password has been set successfuly', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {setPasswordSuccess: true, setPasswordError: ''}});

    expect(wrapper.find('#password-input').exists()).toBe(false);
    expect(wrapper.find('#update-button').exists()).toBe(false);
    expect(wrapper.find('#set-password-error').exists()).toBe(false);

    expect(wrapper.find('#set-password-success').text()).toBe('Thank you, your password has been updated. Click here to return to Montagu.');
    expect(wrapper.find('#set-password-success-link').attributes()["href"]).toBe('/');
});

test('renders correctly with set password error', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {setPasswordSuccess: false, setPasswordError: 'An error occurred'}});

    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#update-button').text()).toBe('Update');
    expect(wrapper.find('#set-password-error').text()).toBe('An error occurred');

    expect(wrapper.find('#set-password-success').exists()).toBe(false);
});

test('emits update password event when form submitted', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {setPasswordSuccess: false, setPasswordError: ''}});

    //set password value
    const input = wrapper.find('#password-input');
    input.element.value = "mypassword";
    input.trigger('input'); //update model

    wrapper.find("form").trigger("submit");

    expect(wrapper.emitted('update-password')).toBeTruthy();
    expect(wrapper.emitted('update-password')[0][0]).toBe('mypassword');
});
