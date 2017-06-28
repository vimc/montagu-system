import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../../Sandbox";
import { ViewAllModellingGroupsPage } from "../../../../../main/admin/components/ModellingGroups/List/ViewAllModellingGroupsPage";
import { mockLocation } from "../../../../mocks/mocks";
import { groupStore } from "../../../../../main/admin/stores/GroupStore";
import { checkAsync } from "../../../../testHelpers";

describe("ViewAllModellingGroupsPageTests", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchGroups = sandbox.sinon.spy(groupStore, "fetchGroups");
        sandbox.mount(<ViewAllModellingGroupsPage location={ mockLocation<undefined>() } />);
        checkAsync(done, () => {
            expect(fetchGroups.called).to.equal(true, "Expected groupStore.fetchGroups to be triggered");
        });
    });
});
