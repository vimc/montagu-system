import { expect } from "chai";

import { authReducer, AuthState, initialAuthState } from "../../../main/shared/reducers/authReducer";
import { TypeKeys } from "../../../main/shared/actionTypes/AuthTypes";

const testAuthData: AuthState = {
    loggedIn: true,
    username: 'test.user',
    bearerToken: 'testtoken',
    permissions: [],
    isAccountActive: true,
    isModeller: false
};

describe('Modelling groups reducer tests', () => {
    it('sets logged in user data', () => {
        expect(authReducer(undefined, {
            type: TypeKeys.AUTHENTICATED,
            data: testAuthData
        })).to.eql(
            testAuthData
        )
    })

    it('reverts state to initial after unauth action', () => {
        expect(authReducer(undefined, {
            type: TypeKeys.UNAUTHENTICATED,
        })).to.eql(
            initialAuthState
        )
    })

    it('sets errror', () => {
        expect(authReducer(undefined, {
            type: TypeKeys.AUTHENTICATION_ERROR,
            error: "Test Error"
        })).to.eql(
            Object.assign({}, initialAuthState, { errorMessage: "Test Error" })
        )
    })
})