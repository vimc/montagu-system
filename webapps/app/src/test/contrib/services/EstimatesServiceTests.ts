import {expect} from "chai";
import {createMemoryHistory} from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {EstimatesService} from "../../../main/contrib/services/EstimatesService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";
import {CreateBurdenEstimateSet} from "../../../main/shared/models/Generated";

describe('Estimates service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history);

    afterEach(() => {
        sandbox.restore();
    });

    it('creates burden post request', () => {
        const estimatesService = new EstimatesService(store.dispatch, store.getState as () => ContribAppState);

        const postStub = sandbox.setStubFunc(estimatesService, "post", ()=>{
            return Promise.resolve();
        });

        const testEstimatesBurden: CreateBurdenEstimateSet = {
            type: {
                type: "central-averaged",
                details: "some details"
            },
            model_run_parameter_set: null
        };

        estimatesService.createBurden("group-1", "touchstone-1", "scenario-1", testEstimatesBurden);

        expect(postStub.getCall(0).args[0])
            .to.equal("/modelling-groups/group-1/responsibilities/touchstone-1/scenario-1/estimate-sets/");
        expect(postStub.getCall(0).args[1])
            .to.equal(JSON.stringify(testEstimatesBurden));
    });

});