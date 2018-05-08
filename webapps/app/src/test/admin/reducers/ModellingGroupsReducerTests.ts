import { expect } from "chai";

import {modellingGroupInitialState, modellingGroupsReducer} from "../../../main/admin/reducers/modellingGroupsReducer";
import {ModellingGroupTypes} from "../../../main/admin/actionTypes/ModellingGroupsTypes";
import {mockModellingGroup, mockModellingGroupDetails, mockUser} from "../../mocks/mockModels";

describe('Admin Modelling Groups reducer tests', () => {

    const testUser = mockUser();
    const testGroup = mockModellingGroup();
    const testGroup2 = mockModellingGroup();
    const testGroupDetails = mockModellingGroupDetails();

    it('sets fetched groups', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.GROUPS_FETCHED,
            data: [testGroup, testGroup2]
        })).to.eql({...modellingGroupInitialState, groups: [testGroup, testGroup2]});
    });

    it('sets fetched groups empty ', () => {

        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.GROUPS_FETCHED,
            data: null
        })).to.eql(modellingGroupInitialState);
    });

    it('sets current group', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_GROUP,
            data: testGroup
        })).to.eql({...modellingGroupInitialState, currentGroup: testGroup});
    });

    it('sets current group empty', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_GROUP,
            data: null
        })).to.eql(modellingGroupInitialState);
    });

    it('sets current group members', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS,
            data: [testUser]
        })).to.eql({...modellingGroupInitialState, currentGroupMembers: [testUser]});
    });

    it('sets current group members empty', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS,
            data: null
        })).to.eql(modellingGroupInitialState);
    });

    it('sets current group details', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.GROUP_DETAILS_FETCHED,
            data: testGroupDetails
        })).to.eql({...modellingGroupInitialState, currentGroupDetails: testGroupDetails});
    });

    it('sets current group details empty', () => {
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.GROUP_DETAILS_FETCHED,
            data: null
        })).to.eql(modellingGroupInitialState);
    });

});