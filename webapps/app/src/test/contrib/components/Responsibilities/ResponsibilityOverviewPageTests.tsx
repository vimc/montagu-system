import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockLocation, setupStores} from "../../../mocks/mocks";
import {expectOneAction} from "../../../actionHelpers";

import {responsibilityStore} from "../../../../main/contrib/stores/ResponsibilityStore";
import {mockModellingGroup, mockResponsibility, mockTouchstone} from "../../../mocks/mockModels";
import {ResponsibilityOverviewPage} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {ResponsibilityOverviewTitleComponent} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewTitle";
import {checkAsync} from "../../../testHelpers";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {makeLoadable} from "../../../../main/contrib/stores/Loadable";
import {mainStore} from "../../../../main/contrib/stores/MainStore";
import {bootstrapStore} from "../../../StoreHelpers";
import {successResult} from "../../../mocks/mockRemote";
import {mockFetcherForMultipleResponses} from "../../../mocks/mockMultipleEndpoints";
import {mockResponsibilitiesEndpoint, mockTouchstonesEndpoint} from "../../../mocks/mockEndpoints";

describe('ResponsibilityOverviewPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("triggers actions when it loads", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon.stub(responsibilityStore, "fetchTouchstones").returns(Promise.resolve(true));
        const fetchResponsibilities = sandbox.sinon.stub(responsibilityStore, "fetchResponsibilities").returns(Promise.resolve(true));
        const location = mockLocation({
            touchstoneId: "touchstone-id",
            groupId: "group-id"
        });
        const group = mockModellingGroup({id: "group-id"});
        const touchstone = mockTouchstone({id: "touchstone-id"});
        setupStores({groups: [group], touchstones: [touchstone]});

        new ResponsibilityOverviewPage({location: location, router: null}).load();

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, {action: "ModellingGroupActions.setCurrentGroup", payload: "group-id"}, 0);
            expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, {action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-id"}, 1);
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
            });
        });
    });

    const page = new ResponsibilityOverviewPage({
        location: mockLocation({
            touchstoneId: "touchstone-1",
            groupId: "group-1"
        }),
        router: null
    });
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([mockModellingGroup({id: "group-1"})])
        });
        mockFetcherForMultipleResponses([
            mockTouchstonesEndpoint([mockTouchstone({id: "touchstone-1"})]),
            mockResponsibilitiesEndpoint(["scenario-1"])
        ]);
    });
});

describe("ResponsibilityOverviewTitleComponent", () => {
    it("renders title based on touchstoneId", () => {
        const touchstone = mockTouchstone({description: "Fizzy pop"});
        const rendered = shallow(<ResponsibilityOverviewTitleComponent touchstone={touchstone}/>);
        const titleText = rendered.text();
        expect(titleText).to.contain("Responsibilities in Fizzy pop");
    });
});