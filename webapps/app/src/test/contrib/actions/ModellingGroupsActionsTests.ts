// import 'babel-polyfill';
import { expect } from "chai";
const configureReduxMockStore  = require('redux-mock-store');

import { Sandbox } from "../../Sandbox";
import { modellingGroupsActions } from "../../../main/contrib/actions/modellingGroupsActions";
import { ModellingGroupsService } from "../../../main/contrib/services/modellingGroupsService";
import { TypeKeys } from "../../../main/contrib/actionTypes/ModellingGroupsTypes";

import thunk from 'redux-thunk';

describe("Modelling groups actions tests", () => {
    const sandbox = new Sandbox();
    const middlewares: any = [thunk]
    let store: any = null;
    const initialState = {auth: {modellingGroups: "test1"}}
    const mockStore = configureReduxMockStore(middlewares);

    const testGroup1 = {id: "test1", description: "Test 1"};

    before(() => {
        store = mockStore(initialState)
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches action groups fetched after it loaded groups", (done) => {
        sandbox.setStubFunc(ModellingGroupsService.prototype, "getGroups", ()=>{
          return Promise.resolve([testGroup1]);
        });
        store.dispatch(modellingGroupsActions.getGroups())
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: TypeKeys.GROUPS_FETCHED, data: [testGroup1] }
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });

});