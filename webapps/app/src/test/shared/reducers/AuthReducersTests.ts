import {expect} from "chai";

import {authReducer, AuthState, initialAuthState, loadAuthState} from "../../../main/shared/reducers/authReducer";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";

const testAuthData: AuthState = {
    receivedBearerToken: true,
    receivedCookies: false,
    username: 'test.user',
    bearerToken: 'testtoken',
    permissions: [],
    isAccountActive: true,
    isModeller: false,
    isReportReviewer: false,
    isReportRunner: false
};

describe('Auth reducer tests', () => {
    it('sets logged in user data', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.AUTHENTICATED,
            data: testAuthData
        })).to.eql(
            testAuthData
        )
    });

    it('reverts state to initial after unauth action', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.UNAUTHENTICATED,
        })).to.eql(
            initialAuthState
        )
    });

    it('sets error', () => {
        expect(authReducer(undefined, {
            type: AuthTypeKeys.AUTHENTICATION_ERROR,
            error: "Test Error"
        })).to.eql(
            Object.assign({}, initialAuthState, {errorMessage: "Test Error"})
        )
    });

    it('sets hasCookies to true after receiving cookies', () => {
        const expected: AuthState = {
            ...initialAuthState,
            receivedCookies: true
        };
        const actual = authReducer(undefined, {type: AuthTypeKeys.RECEIVED_COOKIES});
        expect(actual).to.eql(expected)
    })
});

describe ('loadAuthState tests', () => {
    it('loads basic param values' , () => {
        const result = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["perm1", "perm2"],
            ["group1", "group2"]
        );

        expect(result.username).to.eql("testUser");
        expect(result.receivedBearerToken).to.eql(true);
        expect(result.receivedCookies).to.eql(true);
        expect(result.bearerToken).to.eql("testToken");
        expect(result.permissions).to.eql(["perm1", "perm2"]);
        expect(result.modellingGroups).to.eql(["group1", "group2"]);
    });

    it('sets isAccountActive correctly' , () => {
        const inactive = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["perm1", "perm2"],
            ["group1", "group2"]
        );

        expect(inactive.isAccountActive).to.eql(false)

        const active = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["*/can-login", "perm1", "perm2"],
            ["group1", "group2"]
        );

        expect(active.isAccountActive).to.eql(true)
    });


    it('sets isModeller correctly' , () => {

        const modeller = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["perm1", "perm2"],
            ["group1", "group2"]
        );
        expect(modeller.isModeller).to.eql(true);

        const nonModeller = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["perm1", "perm2"],
             [] as string[]
        );
        expect(nonModeller.isModeller).to.eql(false);
    });

    it('sets isReportReviewer correctly' , () => {
        const reviewer = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["perm1", "perm2", "*/reports.review"],
            ["group1", "group2"]
        );
        expect(reviewer.isReportReviewer).to.eql(true);

        const nonReviewer = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["perm1", "perm2"],
            [] as string[]
        );
        expect(nonReviewer.isReportReviewer).to.eql(false);

    });

    it('sets isReportRunner correctly' , () => {
        const runner = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            ["perm1", "perm2", "*/reports.run"],
            ["group1", "group2"]
        );
        expect(runner.isReportRunner).to.eql(true);

        const nonRunner = loadAuthState(
            "testUser",
            true,
            true,
            "testToken",
            [ "*/reports.review", "perm1", "perm2"],
            [] as string[]
        );
        expect(nonRunner.isReportRunner).to.eql(false);
    });
});