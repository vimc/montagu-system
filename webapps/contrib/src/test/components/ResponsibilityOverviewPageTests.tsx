import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockLocation } from "../mocks/mocks";
import { alt } from "../../main/alt";

import { ResponsibilityOverviewPage } from "../../main/components/Responsibilities/ResponsibilityOverviewPage";
import { mockTouchstone } from "../mocks/mockModels";
import {
    ResponsibilityOverviewTitle,
    ResponsibilityOverviewTitleComponent
} from "../../main/components/Responsibilities/ResponsibilityOverviewTitle";
import { State } from "../../main/stores/TouchstoneStore";

const headerStyles = require("../../main/components/PageWithHeader/PageWithHeader.css");

describe('ResponsibilityOverviewPage', () => {
    it("passes touchstoneId to title component", () => {
        const location = mockLocation({ touchstoneId: "fizzy-pop" });
        const rendered = shallow(<ResponsibilityOverviewPage location={ location } />);
        const title = rendered.find(ResponsibilityOverviewTitle);
        expect(title.prop("touchstoneId")).to.equal("fizzy-pop");
    });
});

describe("ResponsibilityOverviewTitleComponent", () => {
    it("renders title based on touchstoneId", () => {
        const storeState: State = {
            touchstones: [
                mockTouchstone({ id: "a", description: "Abba" }),
                mockTouchstone({ id: "b", description: "Beatles" })
            ],
            ready: true
        };
        const rendered = shallow(<ResponsibilityOverviewTitleComponent
            touchstoneId="a" touchstones={ storeState } />);
        const titleText = rendered.text();
        expect(titleText).to.contain("Responsibilities in Abba");
    });
})