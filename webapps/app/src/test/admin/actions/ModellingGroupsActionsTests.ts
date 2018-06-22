import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {modellingGroupsActionCreators} from "../../../main/admin/actions/modellingGroupsActionCreators";
import {createMockAdminStore, createMockStore} from "../../mocks/mockStore";
import {ModellingGroupsService} from "../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../main/admin/actionTypes/ModellingGroupsTypes";
import {
    mockModellingGroup,
    mockModellingGroupCreation,
    mockModellingGroupDetails,
    mockUser
} from "../../mocks/mockModels";
import {verifyActionThatCallsService} from "../../ActionCreatorTestHelpers";

describe("Admin Modelling groups actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const testUser = mockUser();
    const testUser2 = mockUser();
    const testGroup = mockModellingGroup();
    const testGroup2 = mockModellingGroup();
    const testGroupDetails = mockModellingGroupDetails({id: testGroup.id, members: [testUser.username]});

    it("gets all groups", (done) => {
        const store = createMockStore({});
        const getAllGroupsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", () => {
            return Promise.resolve([testGroup, testGroup2]);
        });
        store.dispatch(modellingGroupsActionCreators.getAllGroups());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: ModellingGroupTypes.GROUPS_FETCHED, data: [testGroup, testGroup2]};
            expect(actions).to.eql([expectedPayload]);
            expect(getAllGroupsServiceStub.called).to.be.true;
            done();
        });
    });

    it("gets group details", (done) => {
        const store = createMockStore({});
        const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", () => {
            return Promise.resolve(testGroupDetails);
        });
        store.dispatch(modellingGroupsActionCreators.getGroupDetails(testGroup.id));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails};
            expect(actions).to.eql([expectedPayload]);
            expect(getGroupDetailsServiceStub.called).to.be.true;
            expect(getGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            done();
        });
    });

    it("sets current group if found in loaded in state groups", (done) => {
        const store = createMockStore({groups: {groups: [testGroup, testGroup2]}});
        store.dispatch(modellingGroupsActionCreators.setCurrentGroup(testGroup.id));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP, data: testGroup};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("sets current group as null if not found in loaded in state groups", (done) => {
        const store = createMockStore({groups: {groups: [testGroup]}});
        store.dispatch(modellingGroupsActionCreators.setCurrentGroup(testGroup2.id));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP, data: null as any};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });


    it("adds member to group, successfully", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const addMemberServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "addMember", () => {
            return Promise.resolve("OK");
        });
        const clearCacheForGroupDetailsServiceStub = sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearCacheForGroupDetails")
        const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", () => {
            return Promise.resolve(testGroupDetails);
        });

        store.dispatch(modellingGroupsActionCreators.addUserToGroup(testGroup.id, testUser.username));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                {type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails},
                {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]}
            ];
            expect(actions).to.eql(expectedPayload);
            expect(addMemberServiceStub.called).to.be.true;
            expect(addMemberServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            expect(addMemberServiceStub.getCall(0).args[1]).to.equal(testUser.username);
            expect(clearCacheForGroupDetailsServiceStub.called).to.be.true;
            expect(clearCacheForGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            expect(getGroupDetailsServiceStub.called).to.be.true;
            expect(getGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            done();
        });
    });

    it("adds member to group, not successfully", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const addMemberServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "addMember", () => {
            return Promise.resolve("");
        });

        store.dispatch(modellingGroupsActionCreators.addUserToGroup(testGroup.id, testUser.username));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [] as any;
            expect(actions).to.eql(expectedPayload);
            expect(addMemberServiceStub.called).to.be.true;
            expect(addMemberServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            expect(addMemberServiceStub.getCall(0).args[1]).to.equal(testUser.username);
            done();
        });
    });

    it("remove member from group, successfully", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const removeMemberServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "removeMember", () => {
            return Promise.resolve("OK");
        });
        const clearCacheForGroupDetailsServiceStub = sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearCacheForGroupDetails")
        const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", () => {
            return Promise.resolve(testGroupDetails);
        });

        store.dispatch(modellingGroupsActionCreators.removeUserFromGroup(testGroup.id, testUser.username));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                {type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails},
                {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]}
            ];
            expect(actions).to.eql(expectedPayload);
            expect(removeMemberServiceStub.called).to.be.true;
            expect(removeMemberServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            expect(removeMemberServiceStub.getCall(0).args[1]).to.equal(testUser.username);
            expect(clearCacheForGroupDetailsServiceStub.called).to.be.true;
            expect(clearCacheForGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            expect(getGroupDetailsServiceStub.called).to.be.true;
            expect(getGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            done();
        });
    });

    it("removes member from group, not successfully", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const removeMemberServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "removeMember", () => {
            return Promise.resolve("");
        });

        store.dispatch(modellingGroupsActionCreators.removeUserFromGroup(testGroup.id, testUser.username));
        setTimeout(() => {
            const actions = store.getActions()
            expect(actions).to.eql([]);
            expect(removeMemberServiceStub.called).to.be.true;
            expect(removeMemberServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            expect(removeMemberServiceStub.getCall(0).args[1]).to.equal(testUser.username);
            done();
        });
    });

    it("clears cache for group details", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const clearCacheForGroupDetailsServiceStub = sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearCacheForGroupDetails")

        store.dispatch(modellingGroupsActionCreators.clearCacheForGroupDetails(testGroup.id));
        setTimeout(() => {
            const actions = store.getActions()
            expect(actions).to.eql([]);
            expect(clearCacheForGroupDetailsServiceStub.called).to.be.true;
            expect(clearCacheForGroupDetailsServiceStub.getCall(0).args[0]).to.equal(testGroup.id);
            done();
        });
    });

    it("sets current members for current group details, empty if no users", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: []}});
        store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [] as any};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("sets current members for current group details, empty if no group details", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: null}, users: {users: [testUser]}});
        store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [] as any};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("sets current members for current group details, empty if no match", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser2]}});
        store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [] as any};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("sets current members for current group details, data if match", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("dispatches ADD_MODELLING_GROUP on group creation", (done) => {

        const newGroup = mockModellingGroupCreation({institution: "imperial", pi: "someone new",
        description: "imperial (someone new)"});

        verifyActionThatCallsService(done, {
            mockServices: () => {
                sandbox.stubService(ModellingGroupsService.prototype, "createGroup");
                sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearGroupListCache");
            },
            callActionCreator: () => modellingGroupsActionCreators.createModellingGroup(newGroup),
            expectTheseActions: [{type: ModellingGroupTypes.SET_SHOW_CREATE_GROUP, data: false},
                {type: ModellingGroupTypes.ADD_MODELLING_GROUP, data: newGroup}]
        })
    });

    it("autogenerate description field when creating a new group", (done) => {

        const newGroup = mockModellingGroupCreation({institution: "imperial", pi: "someone new"});
        const groupWithAutogeneratedDescription = {...newGroup, description: "imperial (someone new)"};

        verifyActionThatCallsService(done, {
            mockServices: () => {
                sandbox.stubService(ModellingGroupsService.prototype, "createGroup");
                sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearGroupListCache");
            },
            callActionCreator: () => modellingGroupsActionCreators.createModellingGroup(newGroup),
            expectTheseActions: [{type: ModellingGroupTypes.SET_SHOW_CREATE_GROUP, data: false},
                {type: ModellingGroupTypes.ADD_MODELLING_GROUP, data: groupWithAutogeneratedDescription}]
        })
    });

    it("clears group list cache on group creation", (done) => {
        const store = createMockAdminStore();

        sandbox.stubService(ModellingGroupsService.prototype, "createGroup");
        const clearCacheStub = sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearGroupListCache");

        store.dispatch(modellingGroupsActionCreators.createModellingGroup(mockModellingGroupCreation()));
        setTimeout(() => {
            expect(clearCacheStub.called).to.be.true;
            done();
        });
    });

    it("dispatches nothing on failed group creation", (done) => {

        verifyActionThatCallsService(done, {
            mockServices: () => {
                sandbox.stubServiceWithFailure(ModellingGroupsService.prototype, "createGroup");
                sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearGroupListCache");
            },
            callActionCreator: () => modellingGroupsActionCreators.createModellingGroup(mockModellingGroupCreation()),
            expectTheseActions: []
        })
    });

});