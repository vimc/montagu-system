import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {ReportVersionSwitcher} from "../../../../main/report/components/Versions/ReportVersionSwitcher";
import {Sandbox} from "../../../Sandbox";

describe("ReportVersionSwitcher", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const v1 = "20170101-000000-aaaaaaaa";
    const v2 = "20170630-000000-bbbbbbbb";
    const v3 = "20171225-000000-cccccccc";

    it("renders one option per version, most recent first", () => {
        const rendered = shallow(<ReportVersionSwitcher
            versions={[v1, v2, v3]}
            currentVersion={null}
            onChangeVersion={null}
        />);
        const options = rendered.find("option");
        expect(options).to.have.length(3);
        expect(options.at(0).prop("value")).to.equal(v3);
        // We'll test the date serialization more thoroughly elsewhere, this
        // is just a single test to check that the right method is getting called
        expect(options.at(0).text()).to.equal("Mon Dec 25 2017, 00:00");
        expect(options.at(1).prop("value")).to.equal(v2);
        expect(options.at(2).prop("value")).to.equal(v1);
    });

    it("renders current version as selected", () => {
        const rendered = shallow(<ReportVersionSwitcher
            versions={[v1, v2, v3]}
            currentVersion={v2}
            onChangeVersion={null}
        />);
        const select = rendered.find("select");
        expect(select.prop("value")).to.eql(v2);
    });

    it("on select fires onChangeVersion", () => {
        const handler = sandbox.sinon.stub();
        const rendered = shallow(<ReportVersionSwitcher
            versions={[v1, v2, v3]}
            currentVersion={null}
            onChangeVersion={handler}
        />);
        const select = rendered.find("select");
        select.simulate("change", {target: {value: "test"}});
        expect(handler.calledWith("test")).to.equal(true, "Expected handler to be called with 'test'");
    });
});