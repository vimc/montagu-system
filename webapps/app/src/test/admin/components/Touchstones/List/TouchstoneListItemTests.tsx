import {mockTouchstone, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {expect} from "chai";
import {TouchstoneListItem} from "../../../../../main/admin/components/Touchstones/List/TouchstoneListItem";
import * as React from "react";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("TouchstoneListItem", () => {
    it("renders first version object", () => {
        const v1 = mockTouchstoneVersion();
        const v2 = mockTouchstoneVersion();
        const t = mockTouchstone({}, [v1, v2]);
        const rendered = shallow(<TouchstoneListItem {...t}/>);
        expect(rendered.find(InternalLink).dive().text()).to.eql(v1.id);
    });
});