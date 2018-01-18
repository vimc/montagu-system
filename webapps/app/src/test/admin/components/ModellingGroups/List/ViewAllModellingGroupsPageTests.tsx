import * as React from "react";
import {expect} from "chai";
import {Sandbox} from "../../../../Sandbox";
import {ViewAllModellingGroupsPage} from "../../../../../main/admin/components/ModellingGroups/List/ViewAllModellingGroupsPage";
import {mockLocation} from "../../../../mocks/mocks";
import {groupStore} from "../../../../../main/admin/stores/GroupStore";
import {checkAsync} from "../../../../testHelpers";
import {addNavigationTests} from "../../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses} from "../../../../mocks/mockMultipleEndpoints";
import {mockModellingGroup} from "../../../../mocks/mockModels";
import alt from "../../../../../main/shared/alt";
import {mockGroupsEndpoint} from "../../../../mocks/mockEndpoints";
import { shallow } from "enzyme";

describe("ViewAllModellingGroupsPageTests", () => {
    const sandbox = new Sandbox();
    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("triggers fetch on load", (done: DoneCallback) => {
        const fetchGroups = sandbox.sinon.spy(groupStore, "fetchGroups");
        const rendered = shallow(<ViewAllModellingGroupsPage location={ mockLocation<undefined>()} router={null} />);
        checkAsync(done, () => {
            expect(fetchGroups.called).to.equal(true, "Expected groupStore.fetchGroups to be triggered");
        });
    });

    const page = new ViewAllModellingGroupsPage({location: mockLocation(), router: null});
    addNavigationTests(page, sandbox, () => {
        mockFetcherForMultipleResponses([
            mockGroupsEndpoint([mockModellingGroup()])
        ])
    });
});
