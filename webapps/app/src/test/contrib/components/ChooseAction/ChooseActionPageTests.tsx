import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../Sandbox";
import { ChooseActionPage, LocationProps } from "../../../../main/contrib/components/ChooseAction/ChooseActionPage";
import { mockLocation } from "../../../mocks/mocks";
import { expectOneAction } from "../../../actionHelpers";
import { checkAsync } from "../../../testHelpers";
import { responsibilityStore } from "../../../../main/contrib/stores/ResponsibilityStore";
import { groupStore } from "../../../../main/admin/stores/GroupStore";
import {addNavigationTests} from "../../../shared/NavigationTests";
import {mockFetcherForMultipleResponses, successResult} from "../../../mocks/mockRemote";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import alt from "../../../../main/shared/alt";
import {bootstrapStore} from "../../../StoreHelpers";
import {MainState, mainStore} from "../../../../main/contrib/stores/MainStore";
import {makeLoadable} from "../../../../main/contrib/stores/Loadable";

describe("ChooseActionPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers setModellingGroup on load", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchTouchstones = sandbox.sinon
            .stub(responsibilityStore, "fetchTouchstones")
            .returns(Promise.resolve(null));
        const fetchGroupDetails = sandbox.sinon.stub(groupStore, "fetchGroupDetails").returns(Promise.resolve({}));
        const location = mockLocation<LocationProps>({ groupId: "gId" });
        new ChooseActionPage({location: location, router: null}).load();
        checkAsync(done, (afterWait) => {
            expect(fetchTouchstones.called).to.equal(true, "Expected responsibilityStore.fetchTouchstones to be called");
            afterWait(done, () => {
                expectOneAction(spy, {
                    action: "ModellingGroupActions.setCurrentGroup",
                    payload: "gId"
                });
            });
        });
    });

    const page = new ChooseActionPage({location: mockLocation({groupId: "group-1"}), router: null});
    addNavigationTests(page, sandbox, () => {
        bootstrapStore(mainStore, {
            modellingGroups: makeLoadable([
                mockModellingGroup({ id: "group-1" }),
                mockModellingGroup({ id: "group-2" }),
            ])
        });
        mockFetcherForMultipleResponses([
            {
                urlFragment: new RegExp("/touchstones/"),
                result: successResult([
                    mockTouchstone(), mockTouchstone()
                ])
            }
        ]);
    });
});