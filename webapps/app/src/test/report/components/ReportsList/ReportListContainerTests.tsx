import * as React from "react";
import { expect } from "chai";
import { mockReport } from "../../../mocks/mockModels";
import {mapStateToProps} from "../../../../main/report/components/ReportsList/ReportsList";
import {mockReportAppState} from "../../../mocks/mockStates";
import {ReportsSortingFields} from "../../../../main/report/actionTypes/ReportsActionsTypes";

describe("ReportListComponent", () => {

    it ("it maps props from initial state", () => {
        const props =  mapStateToProps(mockReportAppState());
        expect(props.reports).to.eql(undefined);
        expect(props.ready).to.eql(false);
    });

    it ("it maps props from state with reports", () => {
        const stateMock = mockReportAppState({reports: { reports: [ mockReport(), mockReport() ]}});
        const props =  mapStateToProps(stateMock);
        expect(props.reports.length).to.eql(2);
        expect(props.ready).to.eql(true);
    });

});

