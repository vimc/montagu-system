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
                userGroups: [testModellingGroup]
            }
        )
    })

    it('should return new state data with no groups', () => {
        expect(modellingGroupsReducer({
            userGroups: [testModellingGroup]
        }, {
            type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED,
            data: []
        })).to.eql(
            {
                userGroups: []
            }
        )
    })
})