import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {oneTimeTokenActionCreators} from "../../../main/shared/actions/oneTimeTokenActionCreators";
import {OneTimeTokenService} from "../../../main/shared/services/OneTimeTokenService";
import {createMockReportStore} from "../../mocks/mockStore";
import {ReportAppState} from "../../../main/report/reducers/reportAppReducers";
import {MockStore} from "redux-mock-store";
import {OnetimeTokenActionType} from "../../../main/shared/actionTypes/OnetimeTokenActions";

describe("Onetime token action creators", () => {
    const sandbox = new Sandbox();
    let store: MockStore<ReportAppState> = null;

    beforeEach(() => {
        store = createMockReportStore();
        sandbox.setStubFunc(OneTimeTokenService.prototype, "fetchToken", () => {
            return Promise.resolve("TOKEN");
        });
    });

    afterEach(() => {
        sandbox.restore()
    });

    it("creates token fetched action", async () => {

        await store.dispatch(oneTimeTokenActionCreators.fetchToken("url", "reporting"));
        const actions = store.getActions();
        expect(actions[0].type).to.eql(OnetimeTokenActionType.TOKEN_FETCHED);
        expect(actions[0].data).to.eql({url: "url", token: "TOKEN"});

    });
});