import { expect } from "chai";

import { modellingGroupsReducer } from "../../../main/contrib/reducers/modellingGroupsReducer";
import { ModellingGroupTypeKeys } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";

const testModellingGroup = {id: "test1", description: "Test 1"};

describe('Modelling groups reducer tests', () => {
    it('should return new state data with groups', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypeKeys.GROUPS_FETCHED,
            data: [testModellingGroup]
        })).to.eql(
            {
                items: [testModellingGroup]
            }
        )
    })

    it('should return new state data with no groups', () => {
        expect(modellingGroupsReducer({
            items: [testModellingGroup]
        }, {
            type: ModellingGroupTypeKeys.GROUPS_FETCHED,
            data: []
        })).to.eql(
            {
                items: []
            }
        )
    })
})