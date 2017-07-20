import * as React from "react";
import {mount, shallow} from "enzyme";
import {VersionListItem} from "../../../main/report/components/Versions/VersionListItem";
import {expect} from "chai";

describe("VersionListItem", () => {
    it("can render", () => {
        const rendered = mount(<VersionListItem version={ "versionname" } report={ "reportname" } />);

        const href = rendered.find('a').at(0).prop("href");
        expect(href).to.eq("/reportname/versionname");
    });

});