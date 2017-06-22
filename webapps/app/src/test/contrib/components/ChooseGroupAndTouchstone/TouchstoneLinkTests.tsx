import * as React from "react";
import { expect } from "chai";
import { mockTouchstone } from "../../../mocks/mockModels";
import { Link } from "simple-react-router";

import { TouchstoneLink } from "../../../../main/contrib/components/ChooseAction/TouchstoneLink";
import { Sandbox } from "../../../Sandbox";
import { expectOneAction } from "../../../actionHelpers";
import { Touchstone } from "../../../../main/shared/models/Generated";
import { shallow } from "enzyme";

const chooseStyles = require("../../../../main/contrib/components/ChooseAction/ChooseTouchstone.css");

function render(touchstone: Touchstone, selected: boolean) {
    return shallow(<TouchstoneLink touchstone={ touchstone } selected={ selected } />).find("div");
}

describe("TouchstoneLink", () => {
    const sandbox = new Sandbox();
    let touchstone: Touchstone = null;

    beforeEach(() => {
        touchstone = mockTouchstone({ id: "touchstone-1", description: "Description 1" });
    });

    afterEach(() => sandbox.restore());

    it("renders correctly", () => {
        const rendered = render(touchstone, false);
        expect(rendered.text()).to.equal("Description 1");
    });

    it("adds class when selected", () => {
        let rendered = render(touchstone, false);
        expect(rendered.hasClass(chooseStyles.selected)).to.equal(false);

        rendered = render(touchstone, true);
        expect(rendered.hasClass(chooseStyles.selected)).to.equal(true);
    });

    it("when clicked triggers action", () => {
        const spy = sandbox.dispatchSpy();
        const rendered = render(touchstone, false);
        rendered.simulate("click");
        expectOneAction(spy, { action: "TouchstoneActions.setCurrentTouchstone", payload: "touchstone-1" });
    });
});