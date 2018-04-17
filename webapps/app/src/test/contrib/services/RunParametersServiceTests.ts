import { expect } from "chai";
import { createMemoryHistory } from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {RunParametersService} from "../../../main/contrib/services/RunParametersService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";

describe('Run Parameters service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history)

    afterEach(() => {
        sandbox.restore();
    });

    it('clears cache for parameters sets', () => {
        const runParametersService = new RunParametersService(store.dispatch, store.getState as () => ContribAppState);

        const clearCacheStub = sandbox.setStubFunc(runParametersService, "clearCache", ()=>{
            return Promise.resolve();
        });

        runParametersService.clearCacheForGetParameterSets("group-2", "touchstone-2");

        expect(clearCacheStub.getCall(0).args[0]).to.equal("runParameters");
        expect(clearCacheStub.getCall(0).args[1]).to.equal("/modelling-groups/group-2/model-run-parameters/touchstone-2/");
    });

    it('fetches parameters sets', () => {
        const runParametersService = new RunParametersService(store.dispatch, store.getState as () => ContribAppState);

        const setOptionsSpy = sandbox.setSpy(runParametersService, "setOptions");
        const getStub = sandbox.setStubFunc(runParametersService, "get", ()=>{
            return Promise.resolve();
        });

        runParametersService.getParameterSets("group-3", "touchstone-3");

        expect(getStub.getCall(0).args[0]).to.equal("/modelling-groups/group-3/model-run-parameters/touchstone-3/");
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: "runParameters" });
    });

    it('fetches one time token', () => {
        const runParametersService = new RunParametersService(store.dispatch, store.getState as () => ContribAppState);

        const getStub = sandbox.setStubFunc(runParametersService, "get", ()=>{
            return Promise.resolve();
        });

        runParametersService.getOneTimeToken("group-3", "touchstone-3", 3);

        expect(getStub.getCall(0).args[0]).to.equal("/modelling-groups/group-3/model-run-parameters/touchstone-3/3/get_onetime_link/");
    });

    it('uploads set', () => {
        const runParametersService = new RunParametersService(store.dispatch, store.getState as () => ContribAppState);

        const postStub = sandbox.setStubFunc(runParametersService, "post", ()=>{
            return Promise.resolve();
        });

        runParametersService.uploadSet("group-3", "touchstone-3", {} as FormData);

        expect(postStub.getCall(0).args[0]).to.equal("/modelling-groups/group-3/model-run-parameters/touchstone-3/");
    });

});