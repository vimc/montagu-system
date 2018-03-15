import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { modellingGroupsActionCreators } from "../../../main/contrib/actions/modellingGroupsActionCreators";
import { ModellingGroupsService } from "../../../main/shared/services/ModellingGroupsService";
import { ModellingGroupTypeKeys } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {createMockStore} from "../../mocks/mockStore";

describe("Modelling groups actions tests", () => {
    const sandbox = new Sandbox();
    let store: any = null;
    const initialState = {auth: {modellingGroups: "test1"}}

    const testGroup1 = {id: "test1", description: "Test 1"};

    before(() => {
        store = createMockStore(initialState);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches action groups fetched after it loaded groups", (done) => {
        sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", ()=>{
          return Promise.resolve([testGroup1]);
        });
        store.dispatch(modellingGroupsActionCreators.getUserGroups())
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: ModellingGroupTypeKeys.USER_GROUPS_FETCHED, data: [testGroup1] }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

});