

import {createMockStore} from "../../mocks/mockStore";
import {ModellingGroupsService} from "../../../main/shared/services/ModellingGroupsService";
import {Sandbox} from "../../Sandbox";
import {AssociateUser} from "../../../main/shared/models/Generated";

describe('Modelling Groups service tests', () => {
    const sandbox = new Sandbox();

    const store = createMockStore();

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches all groups', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(groupsService, "setOptions");
        const getStub = sandbox.setStubFunc(groupsService, "get", ()=>{
            return Promise.resolve();
        });

        groupsService.getAllGroups();

        expect(getStub.mock.calls[0][0])
            .toEqual("/modelling-groups/");
        expect(setOptionsSpy.mock.calls[0][0]).toEqual({ cacheKey: 'groups' });
    });

    it('fetches user groups', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(groupsService, "setOptions");
        const getStub = sandbox.setStubFunc(groupsService, "get", ()=>{
            return Promise.resolve();
        });

        groupsService.getUserGroups();

        expect(getStub.mock.calls[0][0])
            .toEqual("/user/modelling-groups/");
        expect(setOptionsSpy.mock.calls[0][0]).toEqual({ cacheKey: 'userGroups' });
    });

    it('fetches group details', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(groupsService, "setOptions");
        const getStub = sandbox.setStubFunc(groupsService, "get", ()=>{
            return Promise.resolve();
        });

        groupsService.getGroupDetails("g-1");

        expect(getStub.mock.calls[0][0])
            .toEqual("/modelling-groups/g-1/");
        expect(setOptionsSpy.mock.calls[0][0]).toEqual({ cacheKey: 'groupsDetails' });
    });

    it('adds member', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const postStub = sandbox.setStubFunc(groupsService, "post", ()=>{
            return Promise.resolve();
        });

        const associateUser: AssociateUser = {
            username: "u1",
            action: "add"
        };

        groupsService.addMember("g-1", "u1");

        expect(postStub.mock.calls[0][0])
            .toEqual("/modelling-groups/g-1/actions/associate-member/");
        expect(postStub.mock.calls[0][1]).toEqual(JSON.stringify(associateUser));
    });

    it('removes member', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const postStub = sandbox.setStubFunc(groupsService, "post", ()=>{
            return Promise.resolve();
        });

        const associateUser: AssociateUser = {
            username: "u1",
            action: "remove"
        };

        groupsService.removeMember("g-1", "u1");

        expect(postStub.mock.calls[0][0])
            .toEqual("/modelling-groups/g-1/actions/associate-member/");
        expect(postStub.mock.calls[0][1]).toEqual(JSON.stringify(associateUser));
    });

    it('clears cache for group details', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const postStub = sandbox.setStubFunc(groupsService, "clearCache", () => {});

        groupsService.clearCacheForGroupDetails("g-1");

        expect(postStub.mock.calls[0][0]).toEqual("groupsDetails");
        expect(postStub.mock.calls[0][1]).toEqual("/modelling-groups/g-1/");
    });

});