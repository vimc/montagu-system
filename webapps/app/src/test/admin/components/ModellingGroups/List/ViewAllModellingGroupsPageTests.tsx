import * as React from "react";
import {expect} from "chai";
import { createMemoryHistory } from 'history';

import {Sandbox} from "../../../../Sandbox";
import {ViewAllModellingGroupsPage} from "../../../../../main/admin/components/ModellingGroups/List/ViewAllModellingGroupsPage";
import {mockLocation, mockMatch} from "../../../../mocks/mocks";
import {groupStore} from "../../../../../main/admin/stores/GroupStore";
import {checkAsync, checkPromise} from "../../../../testHelpers";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {mockModellingGroup} from "../../../../mocks/mockModels";
import alt from "../../../../../main/shared/alt";
import {mockGroupsEndpoint} from "../../../../mocks/mockEndpoints";

describe("ViewAllModellingGroupsPageTests", () => {
    const sandbox = new Sandbox();
    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchGroups = sandbox.sinon.spy(groupStore, "fetchGroups");
        const promise = new ViewAllModellingGroupsPage().load(undefined);
        checkPromise(done, promise, () => {
            expect(fetchGroups.called).to.equal(true, "Expected groupStore.fetchGroups to be triggered");
        });
    });

    const page = new ViewAllModellingGroupsPage({location: mockLocation(), router: null, history: createMemoryHistory(), match: mockMatch()});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockGroupsEndpoint([mockModellingGroup()])
        ])
    });
});
