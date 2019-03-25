const VueTestUtils = require("@vue/test-utils");

const Vue = require("../../resources/js/third_party/vue.js");
const MontaguLoginStatus = require("../../resources/js/components/montagu-login-status.vue.js");

test('has expected properties', () => {
    expect(MontaguLoginStatus.props.length).toBe(1);
    expect(MontaguLoginStatus.props[0]).toBe("username");
});

test('renders correctly with no username', () => {
    const constructor = Vue.extend(MontaguLoginStatus);
    const vm = new constructor().$mount();
    expect(vm.$el.textContent).toBe('');
});

test('renders correctly with username', () => {
    const constructor = Vue.extend(MontaguLoginStatus);

    const propsData = {username: "testname"};
    const vm = new constructor({propsData: propsData}).$mount();
    expect(vm.$el.textContent).toBe('Logged in as testname | Log out');
});

test('emits logout event when link clicked', () => {
   const wrapper = VueTestUtils.shallowMount(MontaguLoginStatus,
       {propsData: {username: 'testuser'}});

   wrapper.find("#logout-button").trigger("click");

   expect(wrapper.emitted('logout')).toBeTruthy();

});

