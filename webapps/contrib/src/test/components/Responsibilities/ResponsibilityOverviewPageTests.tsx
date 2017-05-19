import * as React from "react";
import { Sandbox } from "../../Sandbox";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockLocation } from "../../mocks/mocks";
import { dispatchSpy, expectOrderedActions } from "../../actionHelpers";

import { ResponsibilityOverviewPage } from "../../../main/components/Responsibilities/Overview/ResponsibilityOverviewPage";
import { mockTouchstone } from "../../mocks/mockModels";
import { ResponsibilityOverviewTitleComponent } from "../../../main/components/Responsibilities/Overview/ResponsibilityOverviewTitle";
import * as ResponsibilityStore from "../../../main/stores/ResponsibilityStore";

describe('ResponsibilityOverviewPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("triggers actions when it mounts", () => {
        const spy = dispatchSpy(sandbox);
        const fetchResponsibilities = sandbox.sinon.stub(ResponsibilityStore.Store, "fetchResponsibilities");
        const location = mockLocation({ touchstoneId: "fizzy-pop" });

        sandbox.mount(<ResponsibilityOverviewPage location={ location } />);

        expectOrderedActions(spy, [
            { action: "TouchstoneActions.setCurrentTouchstone", payload: "fizzy-pop" }
        ], 0);
        expect(fetchResponsibilities.called).to.be.true;
        fetchResponsibilities.restore();
    });
});

describe("ResponsibilityOverviewTitleComponent", () => {
    it("renders title based on touchstoneId", () => {
        const touchstone = mockTouchstone({ description: "Fizzy pop" });
        const rendered = shallow(<ResponsibilityOverviewTitleComponent {...touchstone} />);
        const titleText = rendered.text();
        expect(titleText).to.contain("Responsibilities in Fizzy pop");
    });
});