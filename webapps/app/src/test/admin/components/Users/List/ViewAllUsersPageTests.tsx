import * as React from "react";

import { expect } from "chai";
import { Provider } from "react-redux";
import { Sandbox } from "../../../../Sandbox";
import {mockLocation, mockMatch} from "../../../../mocks/mocks";
import { checkAsync } from "../../../../testHelpers";

import {ViewAllUsersPage} from "../../../../../main/admin/components/Users/List/ViewAllUsersPage";
import {userStore} from "../../../../../main/admin/stores/UserStore";
import {addNavigationTests} from "../../../../shared/NavigationTests";

import { reduxHelper } from "../../../../reduxHelper";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {mockUsersEndpoint} from "../../../../mocks/mockEndpoints";

describe("ViewAllUsersPageTests", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const spy = sandbox.sinon.spy(userStore, "fetchUsers");
        const store = reduxHelper.createAdminUserStore();
        sandbox.mount(<Provider store={store}><ViewAllUsersPage location={ mockLocation() } router={null} match={mockMatch()} history={null}/></Provider>);
        checkAsync(done, () => {
            expect(spy.called).to.equal(true, "Expected usersStore.fetchUsers to be triggered");
        });
    });

    const page = new ViewAllUsersPage({location: mockLocation(), router: null, match: mockMatch(), history: null});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockUsersEndpoint([])
        ]);
    });
});
