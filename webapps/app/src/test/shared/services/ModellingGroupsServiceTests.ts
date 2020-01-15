import { expect } from "chai";

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

    test('fetches all groups', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(groupsService, "setOptions");
        const getStub = sandbox.setStubFunc(groupsService, "get", ()=>{
            return Promise.resolve();
        });

        groupsService.getAllGroups();

        expect(getStub.getCall(0).args[0])
            .to.equal("/modelling-groups/");
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: 'groups' });
    });

    test('fetches user groups', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(groupsService, "setOptions");
        const getStub = sandbox.setStubFunc(groupsService, "get", ()=>{
            return Promise.resolve();
        });

        groupsService.getUserGroups();

        expect(getStub.getCall(0).args[0])
            .to.equal("/user/modelling-groups/");
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: 'userGroups' });
    });

    test('fetches group details', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(groupsService, "setOptions");
        const getStub = sandbox.setStubFunc(groupsService, "get", ()=>{
            return Promise.resolve();
        });

        groupsService.getGroupDetails("g-1");

        expect(getStub.getCall(0).args[0])
            .to.equal("/modelling-groups/g-1/");
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: 'groupsDetails' });
    });

    test('adds member', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const postStub = sandbox.setStubFunc(groupsService, "post", ()=>{
            return Promise.resolve();
        });

        const associateUser: AssociateUser = {
            username: "u1",
            action: "add"
        };

        groupsService.addMember("g-1", "u1");

        expect(postStub.getCall(0).args[0])
            .to.equal("/modelling-groups/g-1/actions/associate-member/");
        expect(postStub.getCall(0).args[1]).to.equal(JSON.stringify(associateUser));
    });

    test('removes member', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const postStub = sandbox.setStubFunc(groupsService, "post", ()=>{
            return Promise.resolve();
        });

        const associateUser: AssociateUser = {
            username: "u1",
            action: "remove"
        };

        groupsService.removeMember("g-1", "u1");

        expect(postStub.getCall(0).args[0])
            .to.equal("/modelling-groups/g-1/actions/associate-member/");
        expect(postStub.getCall(0).args[1]).to.equal(JSON.stringify(associateUser));
    });

    test('clears cache for group details', () => {
        const groupsService = new ModellingGroupsService(store.dispatch, store.getState);

        const postStub = sandbox.setStubFunc(groupsService, "clearCache", () => {});

        groupsService.clearCacheForGroupDetails("g-1");

        expect(postStub.getCall(0).args[0]).to.equal("groupsDetails");
        expect(postStub.getCall(0).args[1]).to.equal("/modelling-groups/g-1/");
    });

});