import { expect } from "chai";
import { createMemoryHistory } from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {EstimatesService} from "../../../main/contrib/services/EstimatesService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";
import {mockBurdenEstimateSet} from "../../mocks/mockModels";

describe('Estimates service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history)

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches one time token', () => {
        const estimatesService = new EstimatesService(store.dispatch, store.getState as () => ContribAppState);

        const getStub = sandbox.setStubFunc(estimatesService, "get", ()=>{
            return Promise.resolve();
        });

        estimatesService.getOneTimeToken("group-1", "touchstone-1", "scenario-1", 3, "test/path");

        expect(getStub.getCall(0).args[0])
            .to.equal("/modelling-groups/group-1/responsibilities/touchstone-1/scenario-1/estimate-sets/3/get_onetime_link/test/path");
    });

    it('creates burden post request', () => {
        const estimatesService = new EstimatesService(store.dispatch, store.getState as () => ContribAppState);

        const postStub = sandbox.setStubFunc(estimatesService, "post", ()=>{
            return Promise.resolve();
        });

        const testEstimatesBurden = mockBurdenEstimateSet()

        estimatesService.createBurden("group-1", "touchstone-1", "scenario-1", testEstimatesBurden);

        expect(postStub.getCall(0).args[0])
            .to.equal("/modelling-groups/group-1/responsibilities/touchstone-1/scenario-1/estimate-sets/");
        expect(postStub.getCall(0).args[1])
            .to.equal(JSON.stringify(testEstimatesBurden));
    });

});