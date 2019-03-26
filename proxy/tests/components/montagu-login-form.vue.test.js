const VueTestUtils = require("@vue/test-utils");
require("../../node_modules/vue/dist/vue.js");
const MontaguLoginForm = require("../../resources/js/components/montagu-login-form.vue.js");

test('has expected properties', () => {
    expect(MontaguLoginForm.props.length).toBe(2);
    expect(MontaguLoginForm.props[0]).toBe("username");
    expect(MontaguLoginForm.props[1]).toBe("loginError");
});

test('renders correctly without error message', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: ''}});

    expect(wrapper.find('#email-input').element.value).toBe('');
    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#login-button').text()).toBe('Log in');
    expect(wrapper.find('#login-error').text()).toBe('');
});

test('renders correctly without error message', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguLoginForm,
        {propsData: {username: '', loginError: 'an error'}});

    expect(wrapper.find('#email-input').element.value).toBe('');
    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#login-button').text()).toBe('Log in');
    expect(wrapper.find('#login-error').text()).toBe('an error');
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