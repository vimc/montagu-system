import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { userActions } from "../../../main/admin/actions/UserActions";
import { mockUser } from "../../mocks/mockModels";
import { userStore } from "../../../main/admin/stores/UserStore";

describe("UserStore", () => {
    beforeEach(() => alt.recycle());

    it("has users after userActions.update", () => {
        const users = [ mockUser(), mockUser() ];
        userActions.update(users);
        expect(userStore.getState().users).to.eql(users);
        expect(userStore.getState().ready).to.be.true;
    });

    it("is blank after userActions.beginFetch", () => {
        userActions.update([ mockUser(), mockUser() ]);
        userActions.beginFetch();
        expect(userStore.getState().users).to.eql([]);
        expect(userStore.getState().ready).to.be.false;
    });
});