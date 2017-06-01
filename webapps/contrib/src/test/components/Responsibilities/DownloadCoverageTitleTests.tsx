import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { mockTouchstone } from "../../mocks/mockModels";

import { DownloadCoverageTitle } from "../../../main/components/Responsibilities/Coverage/DownloadCoverageTitle";
import { Link } from "simple-react-router";

describe("DownloadCoverageTitle", () => {
    it("renders title", () => {
        const rendered = shallow(<DownloadCoverageTitle touchstone={ mockTouchstone() } />)
        expect(rendered.text()).to.contain("Download coverage data");
    });

    it("renders return link", () => {
        const touchstone = mockTouchstone({ id: "some-id" });
        const rendered = shallow(<DownloadCoverageTitle touchstone={ touchstone } />)
        const link = rendered.find(Link);
        expect(link.prop("href")).to.equal("/responsibilities/some-id/");
    });
});