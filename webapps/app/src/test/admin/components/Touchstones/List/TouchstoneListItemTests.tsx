import {mockTouchstone, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {expect} from "chai";
import {TouchstoneListItem} from "../../../../../main/admin/components/Touchstones/List/TouchstoneListItem";
import * as React from "react";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("TouchstoneListItem", () => {
    it("renders links to touchstone and first version page", () => {
        const v1 = mockTouchstoneVersion({id: "v1"});
        const v2 = mockTouchstoneVersion();
        const t = mockTouchstone({id: "t1", description: "desc1"}, [v1, v2]);
        const rendered = shallow(<TouchstoneListItem {...t}/>);
        const cells = rendered.find("td");

        const descriptionCell = cells.at(1);
        expect(descriptionCell.find(InternalLink).dive().text()).to.eql("desc1");
        expect(descriptionCell.find(InternalLink).prop("href")).to.eql("/touchstones/t1/");

        const latestVersionCell = cells.at(3);
        expect(latestVersionCell.find(InternalLink).dive().text()).to.eql(v1.id);
        expect(latestVersionCell.find(InternalLink).prop("href")).to.eql("/touchstones/t1/v1/responsibilities/");
    });
});