import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockLocation, mockMatch, setupStores} from "../../../mocks/mocks";
import {expectOneAction} from "../../../actionHelpers";

import {responsibilityStore} from "../../../../main/contrib/stores/ResponsibilityStore";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import {ResponsibilityOverviewPage} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {ResponsibilityOverviewTitleComponent} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewTitle";
import {checkPromise} from "../../../testHelpers";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {makeLoadable} from "../../../../main/contrib/stores/Loadable";
import {mainStore} from "../../../../main/contrib/stores/MainStore";
import {bootstrapStore} from "../../../StoreHelpers";
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
        const group = mockModellingGroup({id: "group-id"});
        const touchstone = mockTouchstone({id: "touchstone-id"});
        setupStores({groups: [group], touchstones: [touchstone]});

        const promise = new ResponsibilityOverviewPage().load({
            touchstoneId: "touchstone-id",
            groupId: "group-id"
        });
        checkPromise(done, promise, (_, afterWait) => {
            expectOneAction(spy, {action: "ModellingGroupActions.setCurrentGroup", payload: "group-id"}, 0);
            expect(fetchTouchstones.called).to.equal(true, "Expected fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, {action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-id"}, 1);
                expect(fetchResponsibilities.called).to.equal(true, "Expected fetchResponsibilities to be called");
            });
        });
    });

    const location = mockLocation();
    const match = mockMatch({
        touchstoneId: "touchstone-1",
        groupId: "group-1"
    });

    const page = new ResponsibilityOverviewPage({
        location,
        match,
        router: null,
        history: null
    });
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([mockModellingGroup({id: "group-1"})])
        });
        mockFetcherForMultipleResponses([
            mockTouchstonesEndpoint([mockTouchstone({id: "touchstone-1"})],"group-1"),
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