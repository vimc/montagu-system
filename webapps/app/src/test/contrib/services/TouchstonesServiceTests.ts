import { expect } from "chai";
import { createMemoryHistory } from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {TouchstonesService} from "../../../main/contrib/services/TouchstonesService";
import {Sandbox} from "../../Sandbox";
import {ContribAppState} from "../../../main/contrib/reducers/contribAppReducers";

describe('Touchstones service tests', () => {
    const sandbox = new Sandbox();

    const history = createMemoryHistory();
    const store = createContribStore(history)

    afterEach(() => {
        sandbox.restore();
    });

    it('fetches touchstones', () => {
        const touchstoneService = new TouchstonesService(store.dispatch, store.getState as () => ContribAppState);

        const setOptionsSpy = sandbox.setSpy(touchstoneService, "setOptions");
        const getStub = sandbox.setStubFunc(touchstoneService, "get", ()=>{
            return Promise.resolve();
        });

        touchstoneService.getTouchstonesByGroupId('group-1');

        expect(getStub.getCall(0).args[0]).to.equal('/modelling-groups/group-1/responsibilities/');
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({ cacheKey: 'touchstones' });
    });

});
