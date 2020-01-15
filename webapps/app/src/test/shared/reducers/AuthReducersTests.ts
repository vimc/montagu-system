import {expect} from "chai";

import {authReducer, AuthState, initialAuthState, loadAuthState} from "../../../main/shared/reducers/authReducer";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";
import {Sandbox} from "../../Sandbox";
import {helpers} from "../../../main/shared/Helpers";

const testAuthData: AuthState = {
    loggedIn: false,
    username: 'test.user',
    bearerToken: 'testtoken',
    permissions: [],
    isAccountActive: true,
    isModeller: false
};

describe('Auth reducer tests', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test('sets logged in user data', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.AUTHENTICATED,
            data: testAuthData
        })).to.eql(
            testAuthData
        )
    });

    test(
        'reverts state to initial after unauth action and redirects to Montagu',
        () => {
            const redirectStub = sandbox.setStub(helpers, "redirectToMontaguLogin");
            expect(authReducer(undefined, {
                type: AuthTypeKeys.UNAUTHENTICATED,
            })).to.eql(
                initialAuthState
            );
            expect(redirectStub.called).to.be.true;
        }
    );

    test('sets error', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.AUTHENTICATION_ERROR,
            error: "Test Error"
        })).to.eql(
            Object.assign({}, initialAuthState, {errorMessage: "Test Error"})
        )
    });

    test('sets loggedIn to true after receiving cookies', () => {
        const expected: AuthState = {
            ...initialAuthState,
            loggedIn: true
        };
        const actual = authReducer(undefined, {type: AuthTypeKeys.RECEIVED_COOKIES});
        expect(actual).to.eql(expected)
    })
});

describe ('loadAuthState tests', () => {
    test('loads basic param values', () => {
        const result = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
            });

        expect(result.username).to.eql("testUser");
        expect(result.loggedIn).to.eql(true);
        expect(result.bearerToken).to.eql("testToken");
        expect(result.permissions).to.eql(["perm1", "perm2"]);
        expect(result.modellingGroups).to.eql(["group1", "group2"]);
    });

    test('sets isAccountActive correctly', () => {
        const inactive = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
        });

        expect(inactive.isAccountActive).to.eql(false);

        const active = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["*/can-login", "perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
        });

        expect(active.isAccountActive).to.eql(true)
    });


    test('sets isModeller correctly', () => {

        const modeller = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
        });
        expect(modeller.isModeller).to.eql(true);

        const nonModeller = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: [] as string[]
        });
        expect(nonModeller.isModeller).to.eql(false);
    });


});