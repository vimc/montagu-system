import * as React from "react";
import { expect } from "chai";
import { mockReport } from "../../../mocks/mockModels";
import {getDisplayedReportsList, mapStateToProps} from "../../../../main/report/components/ReportsList/ReportsList";
import {mockReportAppState} from "../../../mocks/mockStates";
import {ReportsSortingFields} from "../../../../main/report/actionTypes/ReportsActionsTypes";

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

    it('sorts reports list by name', () => {
        const reportsMock = [mockReport({name: "b"}), mockReport({name: "c"}), mockReport({name: "a"})];
        const sortedReports = getDisplayedReportsList(reportsMock, ReportsSortingFields.name);
        expect(sortedReports[0].name).to.eql("a");
        expect(sortedReports[1].name).to.eql("b");
        expect(sortedReports[2].name).to.eql("c");
    });

    it('sorts reports list by latest version', () => {
        const reportsMock = [
            mockReport({name: "b", latest_version: "20170327-002851-dd944766"}),
            mockReport({name: "c", latest_version: "20170326-002851-dd944766"}),
            mockReport({name: "a", latest_version: "20170328-002851-dd944766"})
        ];
        const sortedReports = getDisplayedReportsList(reportsMock, ReportsSortingFields.latest_version);
        expect(sortedReports[0].name).to.eql("c");
        expect(sortedReports[1].name).to.eql("b");
        expect(sortedReports[2].name).to.eql("a");
    });

});

