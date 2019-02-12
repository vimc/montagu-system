import {expect} from "chai";

import {authReducer, AuthState, initialAuthState} from "../../../main/shared/reducers/authReducer";
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

describe('Modelling groups reducer tests', () => {
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