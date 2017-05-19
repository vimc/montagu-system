import * as React from "react";
import { expect } from "chai";
import { mockTouchstone } from "../mocks/mockModels";
import { Link } from "simple-react-router";

import { TouchstoneLink } from "../../main/components/Touchstones/TouchstoneList";
import { Sandbox } from "../Sandbox";

describe("TouchstoneLink", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders correctly", () => {
        const touchstone = mockTouchstone({ id: "touchstone-1", description: "Description 1" });
        const rendered = sandbox.mount(<TouchstoneLink {...touchstone} />).find(Link);
        expect(rendered.prop('href')).to.equal("/responsibilities/touchstone-1/");
        expect(rendered.text()).to.equal("Description 1");
    });
});