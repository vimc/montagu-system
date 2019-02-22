import * as React from "react";
import {shallow, ShallowWrapper} from "enzyme";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {
    SidebarProps, ReportTabEnum, SidebarComponent, mapStateToProps
} from "../../../../main/report/components/Sidebar/Sidebar";
import {ReportAppState} from "../../../../main/report/reducers/reportAppReducers"
import {mockAuthState, mockReportAppState} from "../../../mocks/mockStates";

describe("Sidebar", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const defaultTabProps: SidebarProps = {
        active: ReportTabEnum.REPORT,
        onChangeVersion: () => {},
        isReviewer: true
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

        const rendered = shallow(<SidebarComponent {...props} />);
        const link = reportLink(rendered);

        expect(link).to.have.lengthOf(1);
        expect(link.prop("active")).to.be.true;

    });

    it("downloads link is active if downloads tab is active", () => {

        const props = defaultTabProps;
        props.active = ReportTabEnum.DOWNLOAD;

        const rendered = shallow(<SidebarComponent {...props} />);
        const link = downloadsLink(rendered);

        expect(link).to.have.lengthOf(1);
        expect(link.prop("active")).to.be.true;

    });

    it("report link changes tab to #reports", () => {

        const rendered = shallow(<SidebarComponent {...defaultTabProps} />);

        expect(reportLink(rendered).prop("href")).to.eq("#report");

    });

    it("downloads link changes tab to #downloads on click", () => {

        const rendered = shallow(<SidebarComponent {...defaultTabProps} />);

        expect(downloadsLink(rendered).prop("href")).to.eq("#downloads");

    });

    it("changelog link is enabled is user is reviewer", () => {

        const rendered = shallow(<SidebarComponent {...defaultTabProps} />);

        expect(changelogLink(rendered).prop("disabled")).to.be.undefined;

    });

    it("changelog link is enabled if user is not reviewer", () => {
        defaultTabProps.isReviewer = false;

        const rendered = shallow(<SidebarComponent {...defaultTabProps} />);

        expect(changelogLink(rendered).prop("disabled")).to.be.undefined;

    });


    it("maps state to props", () => {

        const state = mockReportAppState({
            auth: mockAuthState({isReportReviewer: true})
        });

        expect(mapStateToProps(state).isReviewer).to.eql(true);
    });

});