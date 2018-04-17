import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { modellingGroupsActionCreators } from "../../../main/contrib/actions/modellingGroupsActionCreators";
import { ModellingGroupsService } from "../../../main/shared/services/ModellingGroupsService";
import { ModellingGroupTypes } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {createMockStore} from "../../mocks/mockStore";

describe("Modelling groups actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup1 = {id: "test1", description: "Test 1"};

    afterEach(() => {
        sandbox.restore();
    });

    it("groups fetched", (done) => {
        const initialState = {
            auth: {modellingGroups: "test1"}
        };
        const store = createMockStore(initialState);
        sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", ()=>{
          return Promise.resolve([testGroup1]);
        });
        store.dispatch(modellingGroupsActionCreators.getUserGroups())
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: ModellingGroupTypes.USER_GROUPS_FETCHED, data: [testGroup1] }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

    it("set current group by group id using previously loaded groups", (done) => {
        const initialState = {
            groups: {userGroups: [testGroup1]}
        };
        const store = createMockStore(initialState);
        store.dispatch(modellingGroupsActionCreators.setCurrentGroup("test1"))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: ModellingGroupTypes.SET_CURRENT_USER_GROUP, data: testGroup1 }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

});