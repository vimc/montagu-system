import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { usersActionCreators } from "../../../main/admin/actions/usersActionCreators";
import {createMockStore} from "../../mocks/mockStore";
import {UsersService} from "../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";

describe("Admin Users actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const testUser = mockUser();
    const testUser2 = mockUser();

    it("gets all users", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });
        store.dispatch(usersActionCreators.getAllUsers());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
            expect(actions).to.eql([expectedPayload])
            done();
        });
    });
});