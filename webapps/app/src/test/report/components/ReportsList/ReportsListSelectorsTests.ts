import { expect } from "chai";
import {mockReportAppState} from "../../../mocks/mockStates";
import { reportsListSelectors } from "../../../../main/report/components/ReportsList/reportsListSelectors";

import {mockReport} from "../../../mocks/mockModels";
import {ReportsSortingFields} from "../../../../main/report/actionTypes/ReportsActionsTypes";
import {Sandbox} from "../../../Sandbox";

describe("ReportListSelector", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it ("it selects list", () => {
        const reports = [mockReport(), mockReport()];
        expect(reportsListSelectors.getRawReportsListSelector(mockReportAppState({reports: {reports}}))).to.eql(reports);
    });

    it ("it selects sort by", () => {
        expect(reportsListSelectors.getSortingPropsSelector(mockReportAppState({reports: {reportsSortBy: ReportsSortingFields.name}}))).to.eql("name");
    });

    it ("selects display list with default sorting by name", () => {
        const reports = [mockReport({name: "b"}), mockReport({name: "c"}), mockReport({name: "a"})];
        const selector = reportsListSelectors.createDisplayListSelector();
        const displayReports = selector(mockReportAppState({reports: {reports}}));
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
        const selector = reportsListSelectors.createDisplayListSelector();
        const displayReports = selector(mockReportAppState({reports: {reports, reportsSortBy: ReportsSortingFields.latest_version}}));
        expect(displayReports[0].name).to.eql("b");
        expect(displayReports[1].name).to.eql("c");
        expect(displayReports[2].name).to.eql("a");
    });

    it ("it creates reports display list, does it only once if state has not changed", () => {
        const reports = [mockReport({name: "b"}), mockReport({name: "a"})];
        const makeDisplayListStub = sandbox.setStubFunc(reportsListSelectors, 'makeReportsDisplayList', ()=>{});
        const mockState = mockReportAppState({reports: {reports, reportsSortBy: ReportsSortingFields.name}});
        const selector = reportsListSelectors.createDisplayListSelector();
        selector(mockState);
        expect(makeDisplayListStub.callCount).is.equal(1);
        selector(mockState);
        // make list is not called on second call with same state
        expect(makeDisplayListStub.callCount).is.equal(1);
    });

    it ("it creates reports display list, does it only once, state objects recreated(different) but have same values", () => {
        const reports = [mockReport({name: "b"}), mockReport({name: "a"})];
        const reports2 = [mockReport({name: "b"}), mockReport({name: "a"})];
        const makeDisplayListStub = sandbox.setStubFunc(reportsListSelectors, 'makeReportsDisplayList', ()=>{});
        const mockState = mockReportAppState({reports: {reports, reportsSortBy: ReportsSortingFields.name}});
        const mockState1 = mockReportAppState({reports: {reports: reports2, reportsSortBy: ReportsSortingFields.name}});
        const selector = reportsListSelectors.createDisplayListSelector();
        selector(mockState);
        expect(makeDisplayListStub.callCount).is.equal(1);
        selector(mockState1);
        // make list is not called on second call with same state
        expect(makeDisplayListStub.callCount).is.equal(1);
    });

    it ("it creates reports display list, runs it again if state has changed", () => {
        const reports = [mockReport({name: "b"}), mockReport({name: "a"})];
        const makeDisplayListStub = sandbox.setStubFunc(reportsListSelectors, 'makeReportsDisplayList', ()=>{});
        const mockState = mockReportAppState({reports: {reports, reportsSortBy: ReportsSortingFields.name}});
        // have to create another object, to trigger change, otherwise it will be mutating
        const mockState2 = mockReportAppState({reports: {reports, reportsSortBy: ReportsSortingFields.latest_version}});
        const selector = reportsListSelectors.createDisplayListSelector();
        selector(mockState);
        selector(mockState);
        expect(makeDisplayListStub.callCount).is.equal(1);
        // pass another state
        selector(mockState2);
        expect(makeDisplayListStub.callCount).is.equal(2);
    });
});