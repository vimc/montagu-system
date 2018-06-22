import {mockTouchstone, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {expect} from "chai";
import {TouchstoneListItem} from "../../../../../main/admin/components/Touchstones/List/TouchstoneListItem";
import * as React from "react";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("TouchstoneListItem", () => {
    it("renders first version object", () => {
        const v1 = mockTouchstoneVersion({id: "v1"});
        const v2 = mockTouchstoneVersion();
        const t = mockTouchstone({id: "t1"}, [v1, v2]);
        const rendered = shallow(<TouchstoneListItem {...t}/>);
        expect(rendered.find(InternalLink).dive().text()).to.eql(v1.id);
        expect(rendered.find(InternalLink).prop("href")).to.eql("t1/v1");
    });
});