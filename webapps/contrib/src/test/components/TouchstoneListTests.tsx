import {setupVirtualDOM} from "../JSDomHelpers";
import * as React from "react";
import {expect} from "chai";
import {mount, shallow} from "enzyme";
import {mockTouchstone} from "../mocks";

import {TouchstoneLink, TouchstoneListComponent} from "../../main/components/Touchstones/TouchstoneList";
import * as TouchstoneStore from "../../main/stores/TouchstoneStore";
import {Touchstone} from "../../main/Models";
setupVirtualDOM();

const styles = require("../../main/components/Touchstones/TouchstoneList.css");

function makeStoreState(touchstones: Array<Touchstone>): TouchstoneStore.State {
    return {
        ready: true,
        errorMessage: "",
        touchstones,
    };
}

describe('TouchstoneListComponent', () => {
    describe("renders", () => {
        it("message when there are no finished touchstones", () => {
            const state = makeStoreState([]);
            const rendered = shallow(<TouchstoneListComponent {...state} />);
            expect(rendered.find(`.${styles.finishedTouchstones}`).text()).to.contain("There are no past touchstones.");
        });

        it("one Link per finished touchstone", () => {
            const touchstones = [
                mockTouchstone({id: "touchstone-1", description: "Description 1", status: "finished"}),
                mockTouchstone({id: "touchstone-2", description: "Description 2", status: "finished"})
            ];
            const state = makeStoreState(touchstones);
            const rendered = shallow(<TouchstoneListComponent {...state} />);
            const children = rendered.find(`.${styles.finishedTouchstones}`).find("li");
            expect(children).to.have.length(2);

            // Check the first link in detail
            const first = children.at(0);
            expect(first.key()).to.equal("touchstone-1");
            expect(first.find(TouchstoneLink).props()).to.eql(touchstones[0]);

            // Also do a basic test on the other one, to make sure it's different
            expect(children.at(1).key()).to.equal("touchstone-2");
        });

        it("message when there is no open touchstone", () => {
            const state = makeStoreState([]);
            const rendered = shallow(<TouchstoneListComponent {...state} />);
            expect(rendered.find(`.${styles.openTouchstone}`).text()).to.contain("There is no open touchstone currently.");
        });

        it("link when there is an open touchstone", () => {
            const touchstone = mockTouchstone({id: "touchstone-1", description: "Description 1", status: "open"})
            const state = makeStoreState([touchstone]);
            const rendered = mount(<TouchstoneListComponent {...state} />);
            const link = rendered.find(`.${styles.openTouchstone}`).find(TouchstoneLink);
            expect(link.props()).to.eql(touchstone);
        });
    });
});