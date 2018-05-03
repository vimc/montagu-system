import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { usersActionCreators } from "../../../main/admin/actions/usersActionCreators";
import {createMockStore} from "../../mocks/mockStore";
import {UsersService} from "../../../main/admin/services/UsersService";
// import {UserActionType} from "../../../main/admin/actionTypes/UsersTypes";

// describe("User actions tests", () => {
//     const sandbox = new Sandbox();
//
//     afterEach(() => {
//         sandbox.restore();
//     });
//
//     it("gets user ConfidentialityAgreement", (done) => {
//         const store = createMockStore({});
//         sandbox.setStubFunc(UserService.prototype, "getConfidentiality", ()=>{
//             return Promise.resolve(true);
//         });
//         store.dispatch(userActionCreators.getConfidentialityAgreement())
//         setTimeout(() => {
//             const actions = store.getActions()
//             const expectedPayload = { type: UserActionType.CONFIDENTIALITY_RETRIEVED, data: true}
//             expect(actions).to.eql([expectedPayload])
//             done();
//         });
//     });
//
//     // it("signs Confidentiality Agreement", (done) => {
//     //     const store = createMockStore({});
//     //     sandbox.setStubFunc(UserService.prototype, "signConfidentiality", ()=>{
//     //         return Promise.resolve('OK');
//     //     });
//     //     store.dispatch(userActionCreators.signConfidentialityAgreement())
//     //     setTimeout(() => {
//     //         const actions = store.getActions()
//     //         const expectedPayload = { type: UserActionType.CONFIDENTIALITY_SIGNED}
//     //         expect(actions).to.eql([expectedPayload])
//     //         done();
//     //     });
//     // });
// });