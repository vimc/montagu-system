

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
    isModeller: false,
    canUploadCoverage: false
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
            expect(redirectStub.mock.calls.length).toBe(1);
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
    const basicOptions = {
        username: "testUser",
        loggedIn: true,
        bearerToken: "testToken",
        permissions: ["perm1", "perm2"],
        modellingGroups: ["group1", "group2"]
    };

    it('loads basic param values', () => {
        const result = loadAuthState(basicOptions);
        expect(result.username).toEqual("testUser");
        expect(result.loggedIn).toEqual(true);
        expect(result.bearerToken).toEqual("testToken");
        expect(result.permissions).toEqual(["perm1", "perm2"]);
        expect(result.modellingGroups).toEqual(["group1", "group2"]);
        expect(result.canUploadCoverage).toBe(false);
    });

    it('sets isAccountActive correctly', () => {
        const inactive = loadAuthState(basicOptions);

        expect(inactive.isAccountActive).toEqual(false);

        const active = loadAuthState({
            ...basicOptions,
            permissions: ["*/can-login", "perm1", "perm2"]
        });

        expect(active.isAccountActive).toEqual(true)
    });


    it('sets isModeller correctly', () => {

        const modeller = loadAuthState(basicOptions);
        expect(modeller.isModeller).toEqual(true);

        const nonModeller = loadAuthState({
            ...basicOptions,
            modellingGroups: [] as string[]
        });
        expect(nonModeller.isModeller).toEqual(false);
    });

    it('sets canUploadCoverage if coverage write permission present', () => {
        const result = loadAuthState({
            ...basicOptions,
            permissions: ["*/coverage.write", "perm1", "perm2"]
        });
        expect(result.canUploadCoverage).toBe(true);
    });
});
