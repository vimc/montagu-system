import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockReport } from "../../../mocks/mockModels";
import {ReportListComponent, mapStateToProps} from "../../../../main/report/components/Reports/ReportList";
import {ReportListItem} from "../../../../main/report/components/Reports/ReportListItem";
import {mockReportState} from "../../../mocks/mockStates";

describe("ReportListComponent", () => {
    it("can render two reports", () => {
        const reports = [ mockReport(), mockReport() ];
        const rendered = shallow(<ReportListComponent reports={ reports } ready={true} getReports={()=>{}} />);
        const items = rendered.find(ReportListItem);
        expect(items).to.have.length(2);
    });

    it("renders items alphabetically", () => {
        const reports = [ mockReport({"name": "b"}), mockReport({"name": "c"}), mockReport({"name": "a"}) ];
        const rendered = shallow(<ReportListComponent ready={ true } reports={ reports } getReports={()=>{}} />);
        const items = rendered.find(ReportListItem);
        expect(items).to.have.length(3);
        expect(items.at(0).prop("name")).to.equal("a");
        expect(items.at(1).prop("name")).to.equal("b");
        expect(items.at(2).prop("name")).to.equal("c");
    });

    it ("it maps props from initial state", () => {
        const props =  mapStateToProps(mockReportState());
        expect(props.reports).to.eql([]);
        expect(props.ready).to.eql(false);
    });

    it ("it maps props from state with reports", () => {
        const stateMock = mockReportState({reports: { reports: [ mockReport(), mockReport() ]}});
        const props =  mapStateToProps(stateMock);
        expect(props.reports.length).to.eql(2);
        expect(props.ready).to.eql(true);
    });
});