

import {authReducer, AuthState, initialAuthState, loadAuthState} from "../../../main/shared/reducers/authReducer";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";
import {Sandbox} from "../../Sandbox";
import {helpers} from "../../../main/shared/Helpers";

const testAuthData: AuthState = {
    loggedIn: false,
    username: 'test.user',
    bearerToken: 'testtoken',
    isAccountActive: true,
    isModeller: false,
    canUploadCoverage: false,
    canDownloadCoverage: false,
    canViewGroups: false,
    canViewTouchstones: false,
    canViewUsers: false,
    canReadRoles: false,
    canWriteRoles: false,
    canCreateUsers: false,
    canCreateModellingGroups: false,
    canManageGroupMembers: false
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
        expect(result.modellingGroups).toEqual(["group1", "group2"]);
        const expectAllFalse = (...params: boolean[]) =>
            params.forEach(value => expect(value).toBe(false));
        expectAllFalse(
            result.canDownloadCoverage,
            result.canUploadCoverage,
            result.canViewGroups,
            result.canViewTouchstones,
            result.canViewUsers,
            result.canReadRoles,
            result.canWriteRoles,
            result.canCreateUsers,
            result.canCreateModellingGroups,
            result.canManageGroupMembers
        );
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

    const loadAuthStateWithPermission = (permission: string) => {
        return loadAuthState({
            ...basicOptions,
            permissions: [...basicOptions.permissions, permission]
        });
    };

    it('sets canUploadCoverage if coverage write permission present', () => {
        expect(loadAuthStateWithPermission("*/coverage.write").canUploadCoverage).toBe(true);
    });

    it('sets canDownloadCoverage if coverage read permission present', () => {
        expect(loadAuthStateWithPermission( "*/coverage.read").canDownloadCoverage).toBe(true);
    });

    it('sets canViewGroups if modelling groups read permission present', () => {
        expect(loadAuthStateWithPermission("*/modelling-groups.read").canViewGroups).toBe(true);
    });

    it('sets canViewTouchstones if touchstones read permission present', () => {
        expect(loadAuthStateWithPermission("*/touchstones.read").canViewTouchstones).toBe(true);
    });

    it('sets canViewUsers if users read permission present', () => {
        expect(loadAuthStateWithPermission("*/users.read").canViewUsers).toBe(true);
    });

    it('sets canReadRoles if roles read permission present', () => {
        expect(loadAuthStateWithPermission("*/roles.read").canReadRoles).toBe(true);
    });

    it('sets canWriteRoles if roles write permission present', () => {
        expect(loadAuthStateWithPermission("*/roles.write").canWriteRoles).toBe(true);
    });

    it('sets canCreateUsers if users create permission present', () => {
        expect(loadAuthStateWithPermission("*/users.create").canCreateUsers).toBe(true);
    });

    it('sets canCreateModellingGroups if users create permission present', () => {
        expect(loadAuthStateWithPermission("*/modelling-groups.write").canCreateModellingGroups).toBe(true);
    });

    it('sets canManageGroupMembers if modelling groups manage members permission present', () => {
        expect(loadAuthStateWithPermission("*/modelling-groups.manage-members").canManageGroupMembers).toBe(true);
    });
});
