

import {
    modellingGroupInitialState,
    modellingGroupsReducer
} from "../../../main/contrib/reducers/modellingGroupsReducer";
import { ModellingGroupTypes } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";

describe('Modelling groups reducer tests', () => {

    const testModellingGroup = {id: "test1", description: "Test 1"};

    it('sets fetched user groups', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.USER_GROUPS_FETCHED,
            data: [testModellingGroup]
        })).toEqual({...modellingGroupInitialState, userGroups: [testModellingGroup]});
    });

    it('sets empty user groups', () => {
        expect(modellingGroupsReducer({
            userGroups: [testModellingGroup],
            currentUserGroup: null
        }, {
            type: ModellingGroupTypes.USER_GROUPS_FETCHED,
            data: []
        })).toEqual(modellingGroupInitialState);
    });

    it('sets current user group', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
            data: testModellingGroup
        })).toEqual({...modellingGroupInitialState, currentUserGroup: testModellingGroup});
    });

    it('sets current empty user group', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_USER_GROUP,
            data: null
        })).toEqual(modellingGroupInitialState);
    });
});