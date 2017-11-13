import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../../Sandbox";
import { mockLocation } from "../../../../mocks/mocks";
import { checkAsync } from "../../../../testHelpers";
import {ViewAllUsersPage} from "../../../../../main/admin/components/Users/List/ViewAllUsersPage";
import {userStore} from "../../../../../main/admin/stores/UserStore";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {doNothing} from "../../../../../main/shared/Helpers";

describe("ViewAllUsersPageTests", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const spy = sandbox.sinon.spy(userStore, "fetchUsers");
        sandbox.mount(<ViewAllUsersPage location={ mockLocation<undefined>() } router={null} />);
        checkAsync(done, () => {
            expect(spy.called).to.equal(true, "Expected usersStore.fetchUsers to be triggered");
        });
    });

    addNavigationTests(new ViewAllUsersPage(), sandbox, doNothing);
});
