import { expect } from "chai";
import { createMemoryHistory } from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {ResponsibilitiesService} from "../../../main/contrib/services/ResponsibilitiesService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";

describe('Responsibilities service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history)

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches responsibilities', () => {
        const responsibilitiesService = new ResponsibilitiesService(store.dispatch, store.getState as () => ContribAppState);

        const setOptionsSpy = sandbox.setSpy(responsibilitiesService, "setOptions");
        const getStub = sandbox.setStubFunc(responsibilitiesService, "get", ()=>{
            return Promise.resolve();
        });

        responsibilitiesService.getResponsibilities("group-2", "touchstone-2");

        expect(getStub.getCall(0).args[0]).to.equal("/modelling-groups/group-2/responsibilities/touchstone-2/");
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: 'set' });
    });

    it('clears cache for responsibilities', () => {
        const responsibilitiesService = new ResponsibilitiesService(store.dispatch, store.getState as () => ContribAppState);

        const clearCacheStub = sandbox.setStubFunc(responsibilitiesService, "clearCache", ()=>{
            return Promise.resolve();
        });

        responsibilitiesService.clearCacheForResponsibilities("group-2", "touchstone-2");

        expect(clearCacheStub.getCall(0).args[0]).to.equal("set");
        expect(clearCacheStub.getCall(0).args[1]).to.equal("/modelling-groups/group-2/responsibilities/touchstone-2/");
    });

});