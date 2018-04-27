import { expect } from "chai";

import {userReducer} from "../../../main/contrib/reducers/userReducer";
import {UserActionType} from "../../../main/contrib/actionTypes/UserActionTypes";

describe('User reducer tests', () => {

    it('should return signed confidentiality statement true', () => {
        expect(userReducer({
            signedConfidentialityAgreement: false
        }, {
            type: UserActionType.CONFIDENTIALITY_SIGNED
        })).to.eql(
            {
                signedConfidentialityAgreement: true
            }
        )
    })
});