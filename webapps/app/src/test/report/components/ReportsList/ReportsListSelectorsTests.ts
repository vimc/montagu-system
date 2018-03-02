import { expect } from "chai";
import {mapStateToProps} from "../../../../main/report/components/ReportsList/ReportsList";
import {mockReportAppState} from "../../../mocks/mockStates";
import {
    getDisplayedReportsListSelector,
    getReportsListSelector,
    getSortingPropsSelector
} from "../../../../main/report/components/ReportsList/reportsListSelectors";
import {mockReport} from "../../../mocks/mockModels";
import {ReportsSortingFields} from "../../../../main/report/actionTypes/ReportsActionsTypes";

describe("ReportListSelector", () => {

    it ("it selects list", () => {
        const reports = [mockReport(), mockReport()];
        expect(getReportsListSelector(mockReportAppState({reports: {reports}}))).to.eql(reports);
    });

    it ("it selects sort by", () => {
        expect(getSortingPropsSelector(mockReportAppState({reports: {reportsSortBy: ReportsSortingFields.name}}))).to.eql("name");
    });

    it ("selects display list with default sorting by name", () => {
        const reports = [mockReport({name: "b"}), mockReport({name: "c"}), mockReport({name: "a"})];
        const displayReports = getDisplayedReportsListSelector(mockReportAppState({reports: {reports}}));
        expect(displayReports[0].name).to.eql("a");
        expect(displayReports[1].name).to.eql("b");
        expect(displayReports[2].name).to.eql("c");
    });

    it ("selects display list with sorting by latest_version", () => {
        const reports = [
            mockReport({name: "c", latest_version: "20170327-002851-dd944766"}),
            mockReport({name: "a", latest_version: "20170326-002851-dd944766"}),
            mockReport({name: "b", latest_version: "20170328-002851-dd944766"})
        ];
        const displayReports = getDisplayedReportsListSelector(mockReportAppState({reports: {reports, reportsSortBy: ReportsSortingFields.latest_version}}));
        expect(displayReports[0].name).to.eql("b");
        expect(displayReports[1].name).to.eql("c");
        expect(displayReports[2].name).to.eql("a");
    });
});