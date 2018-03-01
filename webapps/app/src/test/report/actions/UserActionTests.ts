import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {createMockStore} from "../../mocks/mockStore";
import {UserTypeKeys} from "../../../main/report/actionTypes/UsersActionTypes";
import {userActions} from "../../../main/report/actions/userActions";
import {UserService} from "../../../main/report/services/UserService";
import {mockUser} from "../../mocks/mockModels";
import {checkAsync} from "../../testHelpers";

describe("User actions tests", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches report readers fetched action if get report readers action is dispatched", (done) => {
        const fakeUser = mockUser();
        sandbox.setStubFunc(UserService.prototype, "getReportReaders", () => {
            return Promise.resolve([fakeUser]);
        });
        store.dispatch(userActions.getReportReaders("test"));
        checkAsync(done, () => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(UserTypeKeys.REPORT_READERS_FETCHED);
            expect(actions[0].data).to.eql([fakeUser]);
        });
    });

});
