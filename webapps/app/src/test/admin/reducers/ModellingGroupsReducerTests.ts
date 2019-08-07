import { expect } from "chai";

import {modellingGroupInitialState, modellingGroupsReducer} from "../../../main/admin/reducers/modellingGroupsReducer";
import {AddModellingGroup, ModellingGroupTypes} from "../../../main/admin/actionTypes/ModellingGroupsTypes";
import {
    mockModel,
    mockModellingGroup,
    mockModellingGroupDetails,
    mockTouchstoneModelExpectations,
    mockUser
} from "../../mocks/mockModels";

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

    it('sets fetched models', () => {
        const model1 = mockModel();
        const model2 = mockModel();
        const expectation1 = mockTouchstoneModelExpectations();
        const expectation2 = mockTouchstoneModelExpectations();
        expect(modellingGroupsReducer(undefined, {
            type: ModellingGroupTypes.MODELS_FETCHED,
            models: [model1, model2],
            expectations: [expectation1, expectation2]
        })).to.eql({...modellingGroupInitialState, models: [model1, model2],
            expectations: [expectation1, expectation2]});
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

    it('adds new group', () => {
        const newGroup =  {id: "newid", description: "description"};
        const addGroupAction: AddModellingGroup = {
            type: ModellingGroupTypes.ADD_MODELLING_GROUP,
            data: newGroup
        };

        const result = modellingGroupsReducer(undefined, addGroupAction);
        expect(result.groups).to.have.members([newGroup])
    });

});