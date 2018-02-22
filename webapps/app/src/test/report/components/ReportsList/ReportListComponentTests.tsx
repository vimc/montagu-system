import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockReport } from "../../../mocks/mockModels";
import {ReportsListComponent, mapStateToProps} from "../../../../main/report/components/ReportsList/ReportsList";
import {ReportListItem} from "../../../../main/report/components/ReportsList/ReportListItem";
import {mockReportAppState} from "../../../mocks/mockStates";

describe("ReportListComponent", () => {
    it("can render two reports", () => {
        const reports = [ mockReport(), mockReport() ];
        const rendered = shallow(<ReportsListComponent reports={ reports } ready={true} getReports={()=>{}} />);
        const items = rendered.find(ReportListItem);
        expect(items).to.have.length(2);
    });

    it ("it maps props from initial state", () => {
        const props =  mapStateToProps(mockReportAppState());
        expect(props.reports).to.eql([]);
        expect(props.ready).to.eql(false);
    });

    it ("it maps props from state with reports", () => {
        const stateMock = mockReportAppState({reports: { reports: [ mockReport(), mockReport() ]}});
        const props =  mapStateToProps(stateMock);
        expect(props.reports.length).to.eql(2);
        expect(props.ready).to.eql(true);
    });
});