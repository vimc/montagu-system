const VueTestUtils = require("@vue/test-utils");
require("../../node_modules/vue/dist/vue.js");
const MontaguLoginForm = require("../../resources/js/components/montagu-login-form.vue.js");

test('has expected properties', () => {
    expect(MontaguLoginForm.props.length).toBe(3);
    expect(MontaguLoginForm.props[0]).toBe("username");
    expect(MontaguLoginForm.props[1]).toBe("loginError");
    expect(MontaguLoginForm.props[2]).toBe("redirectMessage");
});

test('renders correctly without error message', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: ''}});

    expect(wrapper.find('#email-input').element.value).toBe('');
    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#login-button').text()).toBe('Log in');
    expect(wrapper.find('#login-error').text()).toBe('');

    expect(wrapper.find('#reset-password').text()).toBe('Forgotten your password? Click here');
    expect(wrapper.find('#reset-password-link').attributes()["href"]).toBe('reset-password?email=');
});

test('renders correctly with error message', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: 'an error'}});

    expect(wrapper.find('#email-input').element.value).toBe('');
    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#login-button').text()).toBe('Log in');
    expect(wrapper.find('#login-error').text()).toBe('an error');

    expect(wrapper.find('#reset-password').text()).toBe('Forgotten your password? Click here');
    expect(wrapper.find('#reset-password-link').attributes()["href"]).toBe('reset-password?email=');
});

test('renders reset password link correctly when username is changed', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: 'an error'}});

    const input = wrapper.find('#email-input');
    expect(input.element.value).toBe('');
    input.element.value = "user@example.com";
    input.trigger('input'); //update model

    expect(wrapper.find('#reset-password').text()).toBe('Forgotten your password? Click here');
    expect(wrapper.find('#reset-password-link').attributes()["href"]).toBe('reset-password?email=user@example.com');
});

test('renders with redirect message', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: '', redirectMessage: 'redirect message'}});

    expect(wrapper.find('#redirect-message').text()).toBe('redirect message');
});

test('renders without redirect message', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: '', redirectMessage: ''}});

    expect(wrapper.find('#redirect-message').exists()).toBe(false);
});

test('renders nothing when username is set', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: 'test user', loginError: ''}});

    expect(wrapper.text()).toBe('');
});

test('emits login event when button clicked', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: ''}});

    wrapper.find("#login-button").trigger("click");

    expect(wrapper.emitted('login')).toBeTruthy();

});

test('emits login event when enter pressed in password input', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: ''}});

    wrapper.find("#password-input").trigger("keyup.enter");

    expect(wrapper.emitted('login')).toBeTruthy();

});