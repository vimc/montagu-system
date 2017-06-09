import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockTouchstone } from "../../mocks/mockModels";
import { Sandbox } from "../../Sandbox";

import { Touchstone } from "../../../main/models/Generated";
import { TouchstoneList, TouchstoneListProps } from "../../../main/components/ChooseGroupAndTouchstone/TouchstoneList";
import { TouchstoneLink } from "../../../main/components/ChooseGroupAndTouchstone/TouchstoneLink";

const styles = require("../../../main/components/ChooseGroupAndTouchstone/TouchstoneList.css");

function makeProps(selected?: Touchstone, touchstones?: Array<Touchstone>): TouchstoneListProps {
    return {
        ready: true,
        touchstones: touchstones || [],
        selected: selected || null
    };
}

describe('TouchstoneListComponent renders', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("message when there are no finished touchstones", () => {
        const props = makeProps();
        const rendered = shallow(<TouchstoneList {...props} />);
        expect(rendered.find(`.${styles.finishedTouchstones}`).text()).to.contain("There are no past touchstones.");
    });

    it("one Link per finished touchstone", () => {
        const touchstones = [
            mockTouchstone({ id: "touchstone-1", description: "Description 1", status: "finished" }),
            mockTouchstone({ id: "touchstone-2", description: "Description 2", status: "finished" })
        ];
        const props = makeProps(null, touchstones);
        const rendered = shallow(<TouchstoneList {...props} />);
        const children = rendered.find(`.${styles.finishedTouchstones}`).find("li");
        expect(children).to.have.length(2);

        // Check the first link in detail
        const first = children.at(0);
        expect(first.key()).to.equal("touchstone-1");
        expect(first.find(TouchstoneLink).props()).to.eql({
            selected: false,
            touchstone: touchstones[0]
        });

        // Also do a basic test on the other one, to make sure it's different
        expect(children.at(1).key()).to.equal("touchstone-2");
    });

    it("message when there is no open touchstone", () => {
        const props = makeProps();
        const rendered = shallow(<TouchstoneList {...props} />);
        expect(rendered.find(`.${styles.openTouchstone}`).text()).to.contain("There is no open touchstone currently.");
    });

    it("link when there is an open touchstone", () => {
        const touchstone = mockTouchstone({ id: "touchstone-1", description: "Description 1", status: "open" });
        const props = makeProps(null, [ touchstone ]);
        const rendered = sandbox.mount(<TouchstoneList {...props} />);
        const link = rendered.find(`.${styles.openTouchstone}`).find(TouchstoneLink);
        expect(link.props()).to.eql({
            selected: false,
            touchstone: touchstone
        });
    });

    it("selected link for selected touchstone", () => {
        const touchstone = mockTouchstone({ id: "touchstone-1", description: "Description 1", status: "open" });
        const props = makeProps(touchstone, [ touchstone ]);
        const rendered = sandbox.mount(<TouchstoneList {...props} />);
        const link = rendered.find(`.${styles.openTouchstone}`).find(TouchstoneLink);
        expect(link.props()).to.eql({
            selected: true,
            touchstone: touchstone
        });
    });
});