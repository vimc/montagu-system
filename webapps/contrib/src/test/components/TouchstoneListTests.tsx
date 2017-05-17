import * as React from "react";
import { expect } from "chai";
import { mount, shallow } from "enzyme";
import { mockTouchstone } from "../mocks/mockModels";

import {
    TouchstoneLink, TouchstoneListComponent,
    TouchstoneListProps
} from "../../main/components/Touchstones/TouchstoneList";
import { Touchstone } from "../../main/models/Generated";

const styles = require("../../main/components/Touchstones/TouchstoneList.css");

function makeProps(touchstones: Array<Touchstone>): TouchstoneListProps {
    return {
        ready: true,
        touchstones
    };
}

describe('TouchstoneListComponent', () => {
    describe("renders", () => {
        it("message when there are no finished touchstones", () => {
            const props = makeProps([]);
            const rendered = shallow(<TouchstoneListComponent {...props} />);
            expect(rendered.find(`.${styles.finishedTouchstones}`).text()).to.contain("There are no past touchstones.");
        });

        it("one Link per finished touchstone", () => {
            const touchstones = [
                mockTouchstone({ id: "touchstone-1", description: "Description 1", status: "finished" }),
                mockTouchstone({ id: "touchstone-2", description: "Description 2", status: "finished" })
            ];
            const props = makeProps(touchstones);
            const rendered = shallow(<TouchstoneListComponent {...props} />);
            const children = rendered.find(`.${styles.finishedTouchstones}`).find("li");
            expect(children).to.have.length(2);

            // Check the first link in detail
            const first = children.at(0);
            expect(first.key()).to.equal("touchstone-1");
            expect(first.find(TouchstoneLink).props()).to.eql(touchstones[ 0 ]);

            // Also do a basic test on the other one, to make sure it's different
            expect(children.at(1).key()).to.equal("touchstone-2");
        });

        it("message when there is no open touchstone", () => {
            const props = makeProps([]);
            const rendered = shallow(<TouchstoneListComponent {...props} />);
            expect(rendered.find(`.${styles.openTouchstone}`).text()).to.contain("There is no open touchstone currently.");
        });

        it("link when there is an open touchstone", () => {
            const touchstone = mockTouchstone({ id: "touchstone-1", description: "Description 1", status: "open" });
            const props = makeProps([ touchstone ]);
            const rendered = mount(<TouchstoneListComponent {...props} />);
            const link = rendered.find(`.${styles.openTouchstone}`).find(TouchstoneLink);
            expect(link.props()).to.eql(touchstone);
        });
    });
});