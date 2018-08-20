import {expect} from "chai";
import {createMemoryHistory} from 'history';

import {createContribStore} from "../../../main/contrib/createStore";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {Sandbox} from "../../Sandbox";

describe('Touchstones service tests', () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const history = createMemoryHistory();
    const store = createContribStore(history);

    it('fetches touchstones', () => {
        const touchstoneService = new TouchstonesService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(touchstoneService, "setOptions");
        const getStub = sandbox.setStubFunc(touchstoneService, "get", () => {
            return Promise.resolve();
        });

        touchstoneService.getTouchstonesByGroupId('group-1');

        expect(getStub.getCall(0).args[0]).to.equal('/modelling-groups/group-1/responsibilities/');
        expect(setOptionsSpy.getCall(0).args[0]).to.eql({cacheKey: 'touchstones'});
    });

    it("fetches scenarios", () => {
        const service = new TouchstonesService(store.dispatch, store.getState);

        const setOptionsSpy = sandbox.setSpy(service, "setOptions");
        const getStub = sandbox.setStubFunc(service, "get", () => {
            return Promise.resolve();
        });

        service.getScenariosForTouchstoneVersion("touchstone-1");
        expect(getStub.getCall(0).args).to.eql(['/touchstones/touchstone-1/scenarios/']);
        expect(setOptionsSpy.getCall(0).args).to.eql([{cacheKey: 'touchstones'}]);
    });
});
