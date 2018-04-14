import { expect } from "chai";

import { modellingGroupsReducer } from "../../../main/contrib/reducers/modellingGroupsReducer";
import { ModellingGroupTypes } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";

const testModellingGroup = {id: "test1", description: "Test 1"};

describe('Modelling groups reducer tests', () => {
    it('should return new state data with groups', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.USER_GROUPS_FETCHED,
            data: [testModellingGroup]
        })).to.eql(
            {
                userGroups: [testModellingGroup],
                currentUserGroup: null
            }
        )
    })

    it('should return new state data with no groups', () => {
        expect(modellingGroupsReducer({
            userGroups: [testModellingGroup],
            currentUserGroup: null
        }, {
            type: ModellingGroupTypes.USER_GROUPS_FETCHED,
            data: []
        })).to.eql(
            {
                userGroups: [],
                currentUserGroup: null
            }
        )
    })

    it('should set current group to state', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
            data: testModellingGroup
        })).to.eql(
            {
                currentUserGroup: testModellingGroup,
                userGroups: [],
            }
        )
    })

    it('should set current empty group to state', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
            data: null
        })).to.eql(
            {
                currentUserGroup: null,
                userGroups: [],
            }
        )
    })
})