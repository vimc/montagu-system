import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockLocation } from "../mocks/mocks";
import { alt } from "../../main/alt";

import { ResponsibilityOverviewPage } from "../../main/components/Responsibilities/ResponsibilityOverviewPage";
import { mockTouchstone } from "../mocks/mockModels";

const headerStyles = require("../../main/components/PageWithHeader/PageWithHeader.css");

function checkTitleIs(touchstoneId: string, title: string) {
    const location = mockLocation({ touchstoneId: touchstoneId });
    const rendered = shallow(<ResponsibilityOverviewPage location={ location } />);
    const titleText = rendered.find(`.${headerStyles.pageTitle}`).text();
    expect(titleText).to.contain(title);
}

function setupStore() {
    alt.bootstrap(JSON.stringify({
        TouchstoneStore: {
            touchstones: [
                mockTouchstone({ id: "a", description: "A" }),
                mockTouchstone({ id: "b", description: "B" })
            ],
            errorMessage: "",
            ready: true
        }
    }));
}

describe('ResponsibilityOverviewPage', () => {
    before(setupStore);

    it("renders a title for A when URL is a", () => {
        checkTitleIs("a", "Responsibilities in A");
    });

    it("renders a title for B when URL is b", () => {
        checkTitleIs("b", "Responsibilities in B");
    });
});