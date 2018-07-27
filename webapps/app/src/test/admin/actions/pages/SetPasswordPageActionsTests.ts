import {setPasswordPageActionCreators} from "../../../../main/admin/actions/pages/SetPasswordPageActionCreators";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";
import {expect} from "chai";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {checkAsync} from "../../../testHelpers";

describe("SetPasswordPageActionCreators", () => {
    it("saves token to state", (done: DoneCallback) => {
        const store = createMockAdminStore({});
        store.dispatch(setPasswordPageActionCreators.saveToken("TOKEN"));
        checkAsync(done, () => {
            const actions = store.getActions();
            const expectedPayload = {type: UsersTypes.CHANGE_SET_PASSWORD_TOKEN, token: "TOKEN"};
            expect(actions).to.eql([expectedPayload]);
        });
    });
});