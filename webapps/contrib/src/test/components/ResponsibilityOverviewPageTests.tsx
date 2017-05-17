import * as React from "react";
import * as sinon from "sinon";
import { expect } from "chai";
import { mount, shallow } from "enzyme";
import { mockLocation } from "../mocks/mocks";
import { dispatchSpy, expectOrderedActions } from "../actionHelpers";

import { ResponsibilityOverviewPage } from "../../main/components/Responsibilities/ResponsibilityOverviewPage";
import { mockTouchstone } from "../mocks/mockModels";
import { ResponsibilityOverviewTitleComponent } from "../../main/components/Responsibilities/ResponsibilityOverviewTitle";
import * as ResponsibilityStore from "../../main/stores/ResponsibilityStore";

describe('ResponsibilityOverviewPage', () => {
    it("triggers actions when it mounts", () => {
        const spy = dispatchSpy();
        const fetchResponsibilities = sinon.stub(ResponsibilityStore.Store, "fetchResponsibilities");
        const location = mockLocation({ touchstoneId: "fizzy-pop" });

        const rendered = mount(<ResponsibilityOverviewPage location={ location } />);
        rendered.unmount();

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