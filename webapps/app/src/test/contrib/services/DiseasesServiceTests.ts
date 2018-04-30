import { expect } from "chai";
import { createMemoryHistory } from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {DiseasesService} from "../../../main/contrib/services/DiseasesService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";

describe('Diseases service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history)

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches diseases', () => {
        const diseaseService = new DiseasesService(store.dispatch, store.getState as () => ContribAppState);

        const setOptionsSpy = sandbox.setSpy(diseaseService, "setOptions");
        const getStub = sandbox.setStubFunc(diseaseService, "get", ()=>{
            return Promise.resolve();
        });

        diseaseService.getAllDiseases();

        expect(getStub.getCall(0).args[0]).to.equal('/diseases/');
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: 'diseases' });
    });

});