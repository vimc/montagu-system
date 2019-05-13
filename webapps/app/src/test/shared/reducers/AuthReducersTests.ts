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
    isModeller: false,
    isReportReviewer: false,
    isReportRunner: false
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
        })).to.eql(
            testAuthData
        )
    });

    it('reverts state to initial after unauth action and redirects to Montagu', () => {
        const redirectStub = sandbox.setStub(helpers, "redirectToMontaguLogin");
        expect(authReducer(undefined, {
            type: AuthTypeKeys.UNAUTHENTICATED,
        })).to.eql(
            initialAuthState
        );
        expect(redirectStub.called).to.be.true;
    });

    it('sets error', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.AUTHENTICATION_ERROR,
            error: "Test Error"
        })).to.eql(
            Object.assign({}, initialAuthState, {errorMessage: "Test Error"})
        )
    });

    it('sets loggedIn to true after receiving cookies', () => {
        const expected: AuthState = {
            ...initialAuthState,
            loggedIn: true
        };
        const actual = authReducer(undefined, {type: AuthTypeKeys.RECEIVED_COOKIES});
        expect(actual).to.eql(expected)
    })
});

describe ('loadAuthState tests', () => {
    it('loads basic param values' , () => {
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

    it('sets isAccountActive correctly' , () => {
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


    it('sets isModeller correctly' , () => {

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

    it('sets isReportReviewer correctly' , () => {
        const reviewer = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2", "*/reports.review"],
            modellingGroups: ["group1", "group2"]
        });
        expect(reviewer.isReportReviewer).to.eql(true);

        const nonReviewer = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2"],
            modellingGroups: [] as string[]
        });
        expect(nonReviewer.isReportReviewer).to.eql(false);

    });

    it('sets isReportRunner correctly' , () => {
        const runner = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["perm1", "perm2", "*/reports.run"],
            modellingGroups: ["group1", "group2"]
        });
        expect(runner.isReportRunner).to.eql(true);

        const nonRunner = loadAuthState({
            username: "testUser",
            loggedIn: true,
            bearerToken: "testToken",
            permissions: ["*/reports.review", "perm1", "perm2"],
            modellingGroups: [] as string[]
        });
        expect(nonRunner.isReportRunner).to.eql(false);
    });
});