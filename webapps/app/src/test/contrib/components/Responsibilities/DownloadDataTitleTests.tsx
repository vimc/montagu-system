import * as React from "react";
import { shallow } from "enzyme";
import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-15";
enzyme.configure({ adapter: new Adapter() });

import { expect } from "chai";
import { mockModellingGroup, mockTouchstone } from "../../../mocks/mockModels";

import { DownloadDataTitleComponent } from "../../../../main/contrib/components/Responsibilities/DownloadDataTitle";
import { InternalLink } from "../../../../main/shared/components/InternalLink";

describe("DownloadDataTitleComponent", () => {
    it("renders title", () => {
        const rendered = shallow(<DownloadDataTitleComponent
            modellingGroup={ mockModellingGroup() }
            touchstone={ mockTouchstone() }
            title="A title" />);
        expect(rendered.text()).to.contain("A title");
    });

    it("renders return link", () => {
        const group = mockModellingGroup({ id: "group-id" });
        const touchstone = mockTouchstone({ id: "some-id" });
        const rendered = shallow(<DownloadDataTitleComponent
            touchstone={ touchstone }
            modellingGroup={ group }
            title="A title" />);
        const link = rendered.find(InternalLink);
        expect(link.prop("href")).to.equal("/group-id/responsibilities/some-id/");
    });
});