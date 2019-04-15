const VueTestUtils = require("@vue/test-utils");
const MontaguNewPassword = require("../../resources/js/components/montagu-new-password.vue.js");


test('renders correctly when password has not been set', () => {
    const mockUtils = { paramFromQueryString: jest.fn(() => "token") }
    const mockPasswordApi = {};
    const mockLoginLogic  = {
        tokenHasNotExpired: jest.fn(() => true),
        decodeToken: jest.fn(x => x)
    };

    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {utils: mockUtils, passwordApi: mockPasswordApi, loginLogic: mockLoginLogic }});

    expect(wrapper.find('#password-input').element.value).toBe('');
    expect(wrapper.find('#update-button').text()).toBe('Update');
    expect(wrapper.find('#set-password-error').text()).toBe('');

    expect(wrapper.find('#set-password-success').exists()).toBe(false);
    expect(wrapper.find('#token-invalid').exists()).toBe(false);
});


test('renders correctly when password has been set successfuly', (done) => {
    const mockUtils = { paramFromQueryString: jest.fn(() => "validtoken") }
    const mockPasswordApi = {setPassword: jest.fn(() => new Promise(
            function (resolve, reject){ resolve(); }
        ))};
    const mockLoginLogic  = {
        tokenHasNotExpired: jest.fn(() => true),
        decodeToken: jest.fn(x => x)
    };

    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {utils: mockUtils, passwordApi: mockPasswordApi, loginLogic: mockLoginLogic }});

    //Fill in a new password
    const input = wrapper.find('#password-input');
    expect(input.element.value).toBe('');
    input.element.value = "newpassword";
    input.trigger('input'); //update model

    //Mock press submit button and success response
    wrapper.find("form").trigger("submit");

    //Expect request to have been called with new password and token
    expect(mockPasswordApi.setPassword.mock.calls.length).toBe(1);
    expect(mockPasswordApi.setPassword.mock.calls[0][0]).toBe("newpassword");
    expect(mockPasswordApi.setPassword.mock.calls[0][1]).toBe("validtoken");

    wrapper.vm.$nextTick( () => {
        expect(wrapper.find('#password-input').exists()).toBe(false);
        expect(wrapper.find('#update-button').exists()).toBe(false);
        expect(wrapper.find('#set-password-error').exists()).toBe(false);

        expect(wrapper.find('#set-password-success').text()).toBe('Thank you, your password has been updated. Click here to return to Montagu.');
        expect(wrapper.find('#set-password-success-link').attributes()["href"]).toBe('/');

        expect(wrapper.find('#token-invalid').exists()).toBe(false);

        done();
    });
});

test('renders correctly with set password error', (done) => {
    const mockUtils = { paramFromQueryString: jest.fn(() => "validtoken") }
    const mockPasswordApi = {setPassword: jest.fn(() => new Promise(
            function (resolve, reject){ reject(); }
        ))};
    const mockLoginLogic  = {
        tokenHasNotExpired: jest.fn(() => true),
        decodeToken: jest.fn(x => x)
    };

    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {utils: mockUtils, passwordApi: mockPasswordApi, loginLogic: mockLoginLogic }});

    //Fill in a new password
    const input = wrapper.find('#password-input');
    expect(input.element.value).toBe('');
    input.element.value = "newpassword";
    input.trigger('input'); //update model

    //Mock press submit button and success response
    wrapper.find("form").trigger("submit");

    wrapper.vm.$nextTick( () => {

        expect(wrapper.find('#password-input').element.value).toBe('newpassword');
        expect(wrapper.find('#update-button').text()).toBe('Update');
        expect(wrapper.find('#set-password-error').text()).toBe('An error occurred');

        expect(wrapper.find('#set-password-success').exists()).toBe(false);

        expect(wrapper.find('#token-invalid').exists()).toBe(false);

        done();
    });
});

test('renders correctly when token is invalid', () => {
    const mockUtils = { paramFromQueryString: jest.fn(() => "invalidtoken") }
    const mockPasswordApi = {};
    const mockLoginLogic  = {
        tokenHasNotExpired: jest.fn(() => false),
        decodeToken: jest.fn(x => x)
    };

    const wrapper = VueTestUtils.shallowMount(MontaguNewPassword,
        {propsData: {utils: mockUtils, passwordApi: mockPasswordApi, loginLogic: mockLoginLogic }});

    expect(wrapper.find('#password-input').exists()).toBe(false);
    expect(wrapper.find('#update-button').exists()).toBe(false);
    expect(wrapper.find('#set-password-error').exists()).toBe(false);
    expect(wrapper.find('#set-password-success').exists()).toBe(false);

    expect(wrapper.find('#token-invalid').exists()).toBe(true);
    expect(wrapper.find('#token-invalid-text').text()).toBe("This password reset link has expired. Please request a new one.");
    expect(wrapper.find('#request-new-reset-link-button').text()).toBe("Request new reset password link");
    expect(wrapper.find('#request-new-reset-link-button').attributes()["href"]).toBe('reset-password');
});


