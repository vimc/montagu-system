import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { mockModellingGroup, mockTouchstone } from "../../mocks/mockModels";

import { DownloadCoverageTitleComponent } from "../../../main/components/Responsibilities/Coverage/DownloadCoverageTitle";
import { Link } from "simple-react-router";

describe("DownloadCoverageTitleComponent", () => {
    it("renders title", () => {
        const rendered = shallow(<DownloadCoverageTitleComponent
            modellingGroup={ mockModellingGroup() }
            touchstone={ mockTouchstone() } />)
        expect(rendered.text()).to.contain("Download coverage data");
    });

    it("renders return link", () => {
        const group = mockModellingGroup({ id: "group-id" });
        const touchstone = mockTouchstone({ id: "some-id" });
        const rendered = shallow(<DownloadCoverageTitleComponent
            touchstone={ touchstone }
            modellingGroup={ group } />)
        const link = rendered.find(Link);
        expect(link.prop("href")).to.equal("group-id/responsibilities/some-id/");
    });
});