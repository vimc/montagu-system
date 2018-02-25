import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockReport } from "../../../mocks/mockModels";
import {ReportsListComponent} from "../../../../main/report/components/ReportsList/ReportsListComponent";
import {mapStateToProps} from "../../../../main/report/components/ReportsList/ReportsList";
import {ReportListItem} from "../../../../main/report/components/ReportsList/ReportListItem";
import {mockReportAppState} from "../../../mocks/mockStates";

describe("ReportListComponent", () => {

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