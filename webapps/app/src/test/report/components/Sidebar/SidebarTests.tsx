import * as React from "react";
import {mount, shallow, ShallowWrapper} from "enzyme";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {
    PublicProps, ReportTabEnum, Sidebar
} from "../../../../main/report/components/Sidebar/Sidebar";

describe("Sidebar", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const defaultTabProps: PublicProps = {
        active: ReportTabEnum.REPORT,
        onChangeVersion: () => {}
    };

    const reportLink = (rendered: ShallowWrapper<any, any>): ShallowWrapper<any, any> => {
        const navItems = rendered.find("ul")
            .children();

        return navItems.find({href: "#report"});
    };

    const downloadsLink = (rendered: ShallowWrapper<any, any>): ShallowWrapper<any, any> => {
        const navItems = rendered.find("ul")
            .children();

        return navItems.find({href: "#downloads"});
    };

    const changelogLink = (rendered: ShallowWrapper<any, any>): ShallowWrapper<any, any> => {
        const navItems = rendered.find("ul")
            .children();

        return navItems.find({href: "#changelog"});
    };

    it("report link is active if report tab is active", () => {

        const props = defaultTabProps;
        props.active = ReportTabEnum.REPORT;

        const rendered = shallow(<Sidebar {...props} />);
        const link = reportLink(rendered);

        expect(link).to.have.lengthOf(1);
        expect(link.prop("active")).to.be.true;

    });

    it("downloads link is active if downloads tab is active", () => {

        const props = defaultTabProps;
        props.active = ReportTabEnum.DOWNLOAD;

        const rendered = shallow(<Sidebar {...props} />);
        const link = downloadsLink(rendered);

        expect(link).to.have.lengthOf(1);
        expect(link.prop("active")).to.be.true;

    });

    it("report link changes tab to #reports", () => {

        const rendered = shallow(<Sidebar {...defaultTabProps} />);

        expect(reportLink(rendered).prop("href")).to.eq("#report");

    });

    it("downloads link changes tab to #downloads on click", () => {

        const rendered = shallow(<Sidebar {...defaultTabProps} />);

        expect(downloadsLink(rendered).prop("href")).to.eq("#downloads");

    });

    it("changelog link is disabled", () => {

        const rendered = shallow(<Sidebar {...defaultTabProps} />);

        expect(changelogLink(rendered).prop("disabled")).to.be.true;

    });

});