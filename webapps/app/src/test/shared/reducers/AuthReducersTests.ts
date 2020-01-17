

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

    it('sets logged in user data', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.AUTHENTICATED,
            data: testAuthData
        })).toEqual(
            testAuthData
        )
    });

    it(
        'reverts state to initial after unauth action and redirects to Montagu',
        () => {
            const redirectStub = sandbox.setStub(helpers, "redirectToMontaguLogin");
            expect(authReducer(undefined, {
                type: AuthTypeKeys.UNAUTHENTICATED,
            })).toEqual(
                initialAuthState
            );
            expect(redirectStub.called).toBe(true);
        }
    );

    it('sets error', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.AUTHENTICATION_ERROR,
            error: "Test Error"
        })).toEqual(
            Object.assign({}, initialAuthState, {errorMessage: "Test Error"})
        )
    });

    it('sets loggedIn to true after receiving cookies', () => {
        const expected: AuthState = {
            ...initialAuthState,
            loggedIn: true
        };
        const actual = authReducer(undefined, {type: AuthTypeKeys.RECEIVED_COOKIES});
        expect(actual).toEqual(expected)
    })
});

describe ('loadAuthState tests', () => {
    it('loads basic param values', () => {
        const result = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
            });

        expect(result.username).toEqual("testUser");
        expect(result.loggedIn).toEqual(true);
        expect(result.bearerToken).toEqual("testToken");
        expect(result.permissions).toEqual(["perm1", "perm2"]);
        expect(result.modellingGroups).toEqual(["group1", "group2"]);
    });

    it('sets isAccountActive correctly', () => {
        const inactive = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
        });

        expect(inactive.isAccountActive).toEqual(false);

        const active = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["*/can-login", "perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
        });

        expect(active.isAccountActive).toEqual(true)
    });


    it('sets isModeller correctly', () => {

        const modeller = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: ["group1", "group2"]
        });
        expect(modeller.isModeller).toEqual(true);

        const nonModeller = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: [] as string[]
        });
        expect(nonModeller.isModeller).toEqual(false);
    });


});