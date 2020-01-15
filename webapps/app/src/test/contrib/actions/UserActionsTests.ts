import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { userActionCreators } from "../../../main/contrib/actions/userActionCreators";
import {createMockStore} from "../../mocks/mockStore";
import {UserService} from "../../../main/contrib/services/UserService";
import {UserActionType} from "../../../main/contrib/actionTypes/UserActionTypes";

describe("User actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("gets user ConfidentialityAgreement", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(UserService.prototype, "getConfidentiality", ()=>{
            return Promise.resolve(true);
        });
        store.dispatch(userActionCreators.getConfidentialityAgreement());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: UserActionType.CONFIDENTIALITY_RETRIEVED, data: true};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    test("signs Confidentiality Agreement", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(UserService.prototype, "signConfidentiality", ()=>{
            return Promise.resolve('OK');
        });
        store.dispatch(userActionCreators.signConfidentialityAgreement());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: UserActionType.CONFIDENTIALITY_SIGNED};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });
});