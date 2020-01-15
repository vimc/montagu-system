import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import "../../../helper";
import { mockModellingGroup, mockTouchstoneVersion } from "../../../mocks/mockModels";
import { Sandbox } from "../../../Sandbox";
import { TouchstoneVersion } from "../../../../main/shared/models/Generated";
import { TouchstoneList, TouchstoneListProps } from "../../../../main/contrib/components/ChooseAction/TouchstoneList";
import { ButtonLink } from "../../../../main/shared/components/ButtonLink";

function makeProps(touchstones?: Array<TouchstoneVersion>): TouchstoneListProps {
    return {
        touchstones: touchstones || [],
        group: mockModellingGroup({ id: "gId" })
    };
}

describe('TouchstoneListComponent renders', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test("message when there are no finished touchstones", () => {
        const props = makeProps();
        const rendered = shallow(<TouchstoneList {...props} />);
        expect(rendered.find(".finishedTouchstones").text()).to.contain("There are no past touchstones.");
    });

    test("one button per finished touchstone", () => {
        const touchstones = [
            mockTouchstoneVersion({ id: "touchstone-1", description: "Description 1", status: "finished" }),
            mockTouchstoneVersion({ id: "touchstone-2", description: "Description 2", status: "finished" })
        ];
        const props = makeProps(touchstones);
        const rendered = shallow(<TouchstoneList {...props} />);
        const children = rendered.find(".finishedTouchstones").find("li");
        expect(children).to.have.length(2);

        // Check the first link in detail
        const first = children.at(0);
        expect(first.key()).to.equal("touchstone-2"); //Expect reverse alphabetical order
        expect(first.find(ButtonLink).prop("href")).to.eql("/gId/responsibilities/touchstone-2/");

        // Also do a basic test on the other one, to make sure it's different
        expect(children.at(1).key()).to.equal("touchstone-1");
    });

    test("message when there is no open touchstone", () => {
        const props = makeProps();
        const rendered = shallow(<TouchstoneList {...props} />);
        expect(rendered.find(".openTouchstones").text()).to.contain("There is no open touchstone currently.");
    });

    test("one button per open touchstone", () => {
        const touchstones = [
            mockTouchstoneVersion({ id: "touchstone-1", description: "Description 1", status: "open" }),
            mockTouchstoneVersion({ id: "touchstone-2", description: "Description 2", status: "open" })
        ];
        const props = makeProps(touchstones);
        const rendered = shallow(<TouchstoneList {...props} />);
        const children = rendered.find(".openTouchstones").find("li");
        expect(children).to.have.length(2);

        // Check the first link in detail
        const first = children.at(0);
        expect(first.key()).to.equal("touchstone-2"); //Expect reverse alphabetical order
        expect(first.find(ButtonLink).prop("href")).to.eql("/gId/responsibilities/touchstone-2/");

        // Also do a basic test on the other one, to make sure it's different
        expect(children.at(1).key()).to.equal("touchstone-1");
    });

    test("open touchstones are in expected order", () => {
        //Try with realisitic touchstones with YYYYMM prefix
        const touchstones = [
            mockTouchstoneVersion({ id: "201710gavi-1", description: "Description 1", status: "open" }),
            mockTouchstoneVersion({ id: "201810synthetic-1", description: "Description 1", status: "open" }),
            mockTouchstoneVersion({ id: "201710gavi-5", description: "Description 1", status: "open" }),
            mockTouchstoneVersion({ id: "201810synthetic-2", description: "Description 1", status: "open" })
        ];
        const props = makeProps(touchstones);
        const rendered = shallow(<TouchstoneList {...props} />);
        const children = rendered.find(".openTouchstones").find("li");
        expect(children).to.have.length(4);

        expect(children.at(0).key()).to.equal("201810synthetic-2"); //Expect reverse alphabetical order
        expect(children.at(1).key()).to.equal("201810synthetic-1");
        expect(children.at(2).key()).to.equal("201710gavi-5");
        expect(children.at(3).key()).to.equal("201710gavi-1");

    });
});