const VueTestUtils = require("@vue/test-utils");

const MontaguResetPassword = require("../../resources/js/components/montagu-reset-password.vue.js");


test('renders correctly not showing acknowledgement', () => {

    const mockUtils = { paramFromQueryString: jest.fn(() => "test@example.com") }
    const mockPasswordApi = {};

    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {utils: mockUtils, passwordApi: mockPasswordApi}});

    expect(wrapper.find('#email-input').element.value).toBe('test@example.com');
    expect(wrapper.find('#request-button').text()).toBe('Request password reset email');
    expect(wrapper.find('#reset-password-error').text()).toBe('');

    expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(false);
});

test('renders correctly showing acknowledgement', (done) => {
    const mockUtils = { paramFromQueryString: jest.fn(() => "test@example.com") }
    const mockPasswordApi = {requestResetLink: jest.fn(x => new Promise(
        function (resolve, reject){ resolve(); }
        ))};

    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {utils: mockUtils, passwordApi: mockPasswordApi}});

    //Mock press submit button and success response
    wrapper.find("form").trigger("submit");

    //Expect request to have been called with email address
    expect(mockPasswordApi.requestResetLink.mock.calls.length).toBe(1);
    expect(mockPasswordApi.requestResetLink.mock.calls[0][0]).toBe("test@example.com");

    wrapper.vm.$nextTick( () => {

        expect(wrapper.find('#email-input').element.value).toBe('test@example.com');
        expect(wrapper.find('#request-button').text()).toBe('Request password reset email');
        expect(wrapper.find('#reset-password-error').text()).toBe('');

        expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(true);
        expect(wrapper.find('#show-acknowledgement-text').text()).toBe("Thank you. If we have an account registered for this email address you will receive a reset password link.");

        done();
    });
});

test('renders correctly showing reset password error', (done) => {
    const mockUtils = { paramFromQueryString: jest.fn(() => "test@example.com") }
    const mockPasswordApi = {requestResetLink: jest.fn(x => new Promise(
            function (resolve, reject){ reject(); }
        ))};

    const wrapper = VueTestUtils.shallowMount(MontaguResetPassword,
        {propsData: {utils: mockUtils, passwordApi: mockPasswordApi}});

    //Mock press submit button and success response
    wrapper.find("form").trigger("submit");

    wrapper.vm.$nextTick( () => {

        expect(wrapper.find('#email-input').element.value).toBe('test@example.com');
        expect(wrapper.find('#request-button').text()).toBe('Request password reset email');
        expect(wrapper.find('#reset-password-error').text()).toBe('An error occurred');

        expect(wrapper.find('#show-acknowledgement-text').exists()).toBe(false);
        done();
    });
});




