import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {PublishSwitch} from "../../../../main/report/components/Reports/PublishSwitch";
import {Sandbox} from "../../../Sandbox";
import {mapStateToProps, SidebarComponent, SidebarProps} from "../../../../main/report/components/Reports/Sidebar";
import {mockAuthState, mockReportState} from "../../../mocks/mockStates";

describe("PublishSwitch", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders publish switch if user is reviewer", () => {

        const props: SidebarProps = {
            name: "report-name",
            version: "v1",
            published: true,
            isReviewer: true
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(1);
    });


    it("does not render publish switch if user is not reviewer", () => {

        const props: SidebarProps = {
            name: "report-name",
            version: "v1",
            published: true,
            isReviewer: false
        };

        const rendered = shallow(<SidebarComponent {...props} />);
        expect(rendered.find(PublishSwitch)).to.have.lengthOf(0);
    });

    it("gets publish status and reviewer status from app state", () => {

        const props: Partial<SidebarProps> = {
            name: "report-name",
            version: "v1"
        };

        let state = mockReportState({auth: mockAuthState({permissions: ["*/reports.review"]})});
        let result = mapStateToProps(state, props);

        expect(result.isReviewer).to.be.true;
        expect(result.published).to.be.true;


        state = mockReportState({auth: mockAuthState({permissions: []})});
        result = mapStateToProps(state, props);

        expect(result.isReviewer).to.be.false;
        expect(result.published).to.be.true;

    });

});