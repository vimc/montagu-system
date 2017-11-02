import * as React from "react";
import {mount} from "enzyme";
import {VersionListItem} from "../../../main/report/components/Versions/VersionListItem";
import {expect} from "chai";
import { Sandbox } from "../../Sandbox";

describe("VersionListItem", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("can render", () => {
        const rendered = sandbox.mount(<VersionListItem version={ "versionname" } report={ "reportname" } />);

        const href = rendered.find('a').at(0).prop("href");
        expect(href).to.eq("/reportname/versionname");
    });

});