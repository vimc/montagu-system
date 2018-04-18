import { expect } from "chai";

import { modellingGroupsReducer } from "../../../main/contrib/reducers/modellingGroupsReducer";
import { ModellingGroupTypeKeys } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";

const testModellingGroup = {id: "test1", description: "Test 1"};

describe('Modelling groups reducer tests', () => {
    it('should return new state data with groups', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED,
            data: [testModellingGroup]
        })).to.eql(
            {
                userGroups: [testModellingGroup],
                signedConfidentialityAgreement: false
            }
        )
    })

    it('should return new state data with no groups', () => {
        expect(modellingGroupsReducer({
            userGroups: [testModellingGroup],
            signedConfidentialityAgreement: false
        }, {
            type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED,
            data: []
        })).to.eql(
            {
                userGroups: [],
                signedConfidentialityAgreement: false
            }
        )
    })

    it('should return signed confidentiality statement true', () => {
        expect(modellingGroupsReducer({
            userGroups: [],
            signedConfidentialityAgreement: false
        }, {
            type: ModellingGroupTypeKeys.CONFIDENTIALITY_SIGNED,
            data: true
        })).to.eql(
            {
                userGroups: [],
                signedConfidentialityAgreement: true
            }
        )
    })
})