import {Sandbox} from "../../Sandbox";
import {modellingGroupsActionCreators} from "../../../main/admin/actions/modellingGroupsActionCreators";
import {createMockAdminStore, createMockStore} from "../../mocks/mockStore";
import {ModellingGroupsService} from "../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../main/admin/actionTypes/ModellingGroupsTypes";
import {
    mockModel,
    mockModellingGroup,
    mockModellingGroupCreation,
    mockModellingGroupDetails,
    mockTouchstoneModelExpectations,
    mockUser
} from "../../mocks/mockModels";
import {verifyActionThatCallsService} from "../../ActionCreatorTestHelpers";
import {ExpectationsService} from "../../../main/shared/services/ExpectationsService";

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
            const actions = store.getActions();
            const expectedPayload = {type: ModellingGroupTypes.GROUPS_FETCHED, data: [testGroup, testGroup2]};
            expect(actions).toEqual([expectedPayload]);
            expect(getAllGroupsServiceStub.called).toBe(true);
            done();
        });
    });

    it("gets all models and expectations", async () => {
        const testModel = mockModel();
        const testModel2 = mockModel();
        const testExpectation = mockTouchstoneModelExpectations();
        const testExpectation2 = mockTouchstoneModelExpectations();
        const store = createMockStore({});
        const getAllGroupsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllModels", () => {
            return Promise.resolve([testModel, testModel2]);
        });
        const getAllExpectationsServiceStub = sandbox.setStubFunc(ExpectationsService.prototype, "getAllExpectations",
            () => {
                return Promise.resolve([testExpectation, testExpectation2]);
            });

        await store.dispatch(modellingGroupsActionCreators.getAllModelsAndExpectations());

        const actions = store.getActions();

        expect(getAllGroupsServiceStub.called).toBe(true);
        expect(getAllExpectationsServiceStub.called).toBe(true);

        const expectedPayload = {
            type: ModellingGroupTypes.MODELS_FETCHED, models: [testModel, testModel2],
            expectations: [testExpectation, testExpectation2]
        };
        expect(actions).toEqual([expectedPayload]);

    });

    it("gets group details", (done) => {
        const store = createMockStore({});
        const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", () => {
            return Promise.resolve(testGroupDetails);
        });
        store.dispatch(modellingGroupsActionCreators.getGroupDetails(testGroup.id));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails};
            expect(actions).toEqual([expectedPayload]);
            expect(getGroupDetailsServiceStub.called).toBe(true);
            expect(getGroupDetailsServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            done();
        });
    });

    it("sets current group if found in loaded in state groups", (done) => {
        const store = createMockStore({groups: {groups: [testGroup, testGroup2]}});
        store.dispatch(modellingGroupsActionCreators.setCurrentGroup(testGroup.id));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP, data: testGroup};
            expect(actions).toEqual([expectedPayload]);
            done();
        });
    });

    it(
        "sets current group as null if not found in loaded in state groups",
        (done) => {
            const store = createMockStore({groups: {groups: [testGroup]}});
            store.dispatch(modellingGroupsActionCreators.setCurrentGroup(testGroup2.id));
            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP, data: null as any};
                expect(actions).toEqual([expectedPayload]);
                done();
            });
        }
    );


    it("adds member to group, successfully", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const addMemberServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "addMember", () => {
            return Promise.resolve("OK");
        });
        const clearCacheForGroupDetailsServiceStub = sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearCacheForGroupDetails");
        const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", () => {
            return Promise.resolve(testGroupDetails);
        });

        store.dispatch(modellingGroupsActionCreators.addUserToGroup(testGroup.id, testUser.username));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                {type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails},
                {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]}
            ];
            expect(actions).toEqual(expectedPayload);
            expect(addMemberServiceStub.called).toBe(true);
            expect(addMemberServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            expect(addMemberServiceStub.getCall(0).args[1]).toEqual(testUser.username);
            expect(clearCacheForGroupDetailsServiceStub.called).toBe(true);
            expect(clearCacheForGroupDetailsServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            expect(getGroupDetailsServiceStub.called).toBe(true);
            expect(getGroupDetailsServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
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
            const actions = store.getActions();
            const expectedPayload = [] as any;
            expect(actions).toEqual(expectedPayload);
            expect(addMemberServiceStub.called).toBe(true);
            expect(addMemberServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            expect(addMemberServiceStub.getCall(0).args[1]).toEqual(testUser.username);
            done();
        });
    });

    it("remove member from group, successfully", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const removeMemberServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "removeMember", () => {
            return Promise.resolve("OK");
        });
        const clearCacheForGroupDetailsServiceStub = sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearCacheForGroupDetails");
        const getGroupDetailsServiceStub = sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroupDetails", () => {
            return Promise.resolve(testGroupDetails);
        });

        store.dispatch(modellingGroupsActionCreators.removeUserFromGroup(testGroup.id, testUser.username));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = [
                {type: ModellingGroupTypes.GROUP_DETAILS_FETCHED, data: testGroupDetails},
                {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]}
            ];
            expect(actions).toEqual(expectedPayload);
            expect(removeMemberServiceStub.called).toBe(true);
            expect(removeMemberServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            expect(removeMemberServiceStub.getCall(0).args[1]).toEqual(testUser.username);
            expect(clearCacheForGroupDetailsServiceStub.called).toBe(true);
            expect(clearCacheForGroupDetailsServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            expect(getGroupDetailsServiceStub.called).toBe(true);
            expect(getGroupDetailsServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
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
            const actions = store.getActions();
            expect(actions).toEqual([]);
            expect(removeMemberServiceStub.called).toBe(true);
            expect(removeMemberServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            expect(removeMemberServiceStub.getCall(0).args[1]).toEqual(testUser.username);
            done();
        });
    });

    it("clears cache for group details", (done) => {
        const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: [testUser]}});
        const clearCacheForGroupDetailsServiceStub = sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearCacheForGroupDetails");

        store.dispatch(modellingGroupsActionCreators.clearCacheForGroupDetails(testGroup.id));
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions).toEqual([]);
            expect(clearCacheForGroupDetailsServiceStub.called).toBe(true);
            expect(clearCacheForGroupDetailsServiceStub.getCall(0).args[0]).toEqual(testGroup.id);
            done();
        });
    });

    it(
        "sets current members for current group details, empty if no users",
        (done) => {
            const store = createMockStore({groups: {currentGroupDetails: testGroupDetails}, users: {users: []}});
            store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [] as any};
                expect(actions).toEqual([expectedPayload]);
                done();
            });
        }
    );

    it(
        "sets current members for current group details, empty if no group details",
        (done) => {
            const store = createMockStore({groups: {currentGroupDetails: null}, users: {users: [testUser]}});
            store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [] as any};
                expect(actions).toEqual([expectedPayload]);
                done();
            });
        }
    );

    it(
        "sets current members for current group details, empty if no match",
        (done) => {
            const store = createMockStore({
                groups: {currentGroupDetails: testGroupDetails},
                users: {users: [testUser2]}
            });
            store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [] as any};
                expect(actions).toEqual([expectedPayload]);
                done();
            });
        }
    );

    it(
        "sets current members for current group details, data if match",
        (done) => {
            const store = createMockStore({
                groups: {currentGroupDetails: testGroupDetails},
                users: {users: [testUser]}
            });
            store.dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
            setTimeout(() => {
                const actions = store.getActions();
                const expectedPayload = {type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS, data: [testUser]};
                expect(actions).toEqual([expectedPayload]);
                done();
            });
        }
    );

    it("dispatches ADD_MODELLING_GROUP on group creation", (done) => {

        const newGroup = mockModellingGroupCreation({
            institution: "imperial", pi: "someone new",
            description: "imperial (someone new)"
        });

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
            expect(clearCacheStub.called).toBe(true);
            done();
        });
    });

    it("dispatches nothing on failed group creation", async () => {
        const store = createMockStore({});
        sandbox.stubServiceWithFailure(ModellingGroupsService.prototype, "createGroup");
        sandbox.setStubReduxAction(ModellingGroupsService.prototype, "clearGroupListCache");

        try {
            await store.dispatch(modellingGroupsActionCreators.createModellingGroup(mockModellingGroupCreation()))
        } catch {

        }
        const actions = store.getActions();
        expect(actions).toEqual([]);
    });

});