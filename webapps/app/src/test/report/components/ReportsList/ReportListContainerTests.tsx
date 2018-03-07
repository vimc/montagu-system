import * as React from "react";
import { expect } from "chai";
import {shallow} from "enzyme";

import "../../../helper";
import { mockReport } from "../../../mocks/mockModels";
import {mapStateToProps, ReportsList} from "../../../../main/report/components/ReportsList/ReportsList";
import {mockReportAppState} from "../../../mocks/mockStates";
import {Sandbox} from "../../../Sandbox";
import {reportsActions} from "../../../../main/report/actions/reportsActions";
import {createMockStore} from "../../../mocks/mockStore";
import { LoadingElement } from "../../../../main/shared/partials/LoadingElement/LoadingElement";
import {ReportsListComponent} from "../../../../main/report/components/ReportsList/ReportsListComponent";

describe("ReportListComponent", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

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

    it ("tests lifecycle, triggers get reports on component mount ", () => {
        let store = createMockStore({reports: {reports: null}});
        const getReportsActionStub = sandbox.setStubReduxAction(reportsActions, 'getReports');
        // 1 dive leads us to bypass first hoc, so we pass connect and stop on lifecycle
        const rendered = shallow(<ReportsList />, {context: {store}}).dive();
        expect(getReportsActionStub.called).to.eq(true);
    });

    it ("tests branch, doesn't branch rendering to component is loading is state is ready ", () => {
        let store = createMockStore({reports: {reports: [], reportsFilter: {}}});
        sandbox.setStubReduxAction(reportsActions, 'getReports');
        // 2 dives leads us to branch
        const rendered = shallow(<ReportsList />, {context: {store}}).dive().dive();
        const branchedElement = rendered.find(ReportsListComponent);
        expect(branchedElement.length).to.eq(1);
    });

    it ("tests branch, branches rendering to component is loading is state not ready ", () => {
        let store = createMockStore({reports: {reports: null}});
        const getReportsActionStub = sandbox.setStubReduxAction(reportsActions, 'getReports');
        // 2 dives leads us to branch, 3rd needed to pass renderComponent
        const rendered = shallow(<ReportsList />, {context: {store}}).dive().dive().dive();
        const branchedElement = rendered.find(LoadingElement);
        expect(branchedElement.length).to.eq(1);
    });

});

