const PackitAuth = require("../resources/js/packit-auth.js");

const mockAjax = jest.fn();
global.$ = {
    ajax: mockAjax
};

beforeEach(() => {
    jest.clearAllMocks();
});

test("can login with montagu token", () => {
    //const ajaxSpy = jest.spyOn($, "ajax");
    const sut = new PackitAuth("/testpackit/api/", jest.fn());
    const token = "test_token";
    sut.login(token);
    expect(mockAjax).toHaveBeenCalledWith({
        type: "GET",
        url: "/testpackit/api/auth/login/montagu",
        headers: {
            "Authorization": "Bearer test_token"
        }
    });
});

test("can save user", () => {
    const mockDecode = jest.fn(() => ({
        exp: 100,
        displayName: "Test User",
        userName: "test.user"
    }));
    const token = "test_token";
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
    const sut = new PackitAuth("", mockDecode);
    sut.saveUser({ token });
    const expectedSavedUser = JSON.stringify({
        token,
        exp: 100,
        displayName: "Test User",
        userName: "test.user",
    });
    expect(setItemSpy).toHaveBeenCalledWith("user", expectedSavedUser);
});

test("can delete user", () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");
    const sut = new PackitAuth("", jest.fn());
    sut.deleteUser();
    expect(removeItemSpy).toHaveBeenCalledWith("user");
});