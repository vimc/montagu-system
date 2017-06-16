import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../../Sandbox";
import { ViewAllModellingGroupsPage } from "../../../../../main/admin/components/ModellingGroups/List/ViewAllModellingGroupsPage";
import { mockLocation } from "../../../../mocks/mocks";
import { groupStore } from "../../../../../main/admin/stores/GroupStore";

describe("ViewAllModellingGroupsPageTests", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers fetch on load", () => {
        const spy = sandbox.sinon.spy(groupStore, "fetch");
        sandbox.mount(<ViewAllModellingGroupsPage location={ mockLocation<undefined>() } />);

        expect(spy.called).to.equal(true, "Expected groupStore.fetch to be triggered");
    });
});
