const VueTestUtils = require("@vue/test-utils");

const Vue = require("../../node_modules/vue/dist/vue.js");
const MontaguResetPassword = require("../../resources/js/components/montagu-reset-password.vue.js");

test('has expected properties', () => {
    expect(MontaguResetPassword.props.length).toBe(2);
    expect(MontaguResetPassword.props[0]).toBe("email");
    expect(MontaguResetPassword.props[1]).toBe("showAcknowledgement");
});


test('renders correctly not showing acknowledgement', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {email: 'email@example.com', showAcknowledgement: false}});

    expect(wrapper.find('#email-input').element.value).toBe('email@example.com');
    expect(wrapper.find('#request-button').text()).toBe('Request password reset email');

    expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(false);
});

test('renders correctly showing acknowledgement', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {email: 'email@example.com', showAcknowledgement: true}});

    expect(wrapper.find('#email-input').element.value).toBe('email@example.com');
    expect(wrapper.find('#request-button').text()).toBe('Request password reset email');

    expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(true);
    expect(wrapper.find('#show-acknowledgement-text').text()).toBe("Thank you. If we have an account registered for this email address you will receive a reset password link.");
});

test('emits requestLink event when button clicked', () => {
    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {email: 'email@example.com', showAcknowledgement: false}});

    wrapper.find("#request-button").trigger("click");

    expect(wrapper.emitted('request-reset-link')).toBeTruthy();
    expect(wrapper.emitted('request-reset-link')[0][0]).toBe('email@example.com');
});


