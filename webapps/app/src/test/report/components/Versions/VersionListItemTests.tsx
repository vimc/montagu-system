import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import {VersionListItem} from "../../../../main/report/components/Versions/VersionListItem";

describe("UserListItem", () => {
    it("renders internal link", () => {
        const rendered = shallow(<VersionListItem version={"v"} report={"reportname"} />);

        expect(rendered.find('InternalLink').at(0).prop("href")).to.eq("/reportname/v/");

    });
});