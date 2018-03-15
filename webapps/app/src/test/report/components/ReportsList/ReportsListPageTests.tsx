import * as React from "react";
import { createMemoryHistory } from 'history';
import { Provider } from "react-redux";
import { mount } from "enzyme";
import { expect } from "chai";
import "../../../helper";

import {
    ReportsListPage,
    ReportsListPageComponent
} from "../../../../main/report/components/ReportsList/ReportsListPage";
import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ReportsService} from "../../../../main/report/services/ReportsService";
import {BreadcrumbsTypeKeys} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {createReportStore} from "../../../../main/report/stores/createReportStore";
import {ReportAppState} from "../../../../main/report/reducers/reportAppReducers";

describe("Reporting MainMenu", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("generates breadcrumbs on mount", (done: DoneCallback) => {
        const history = createMemoryHistory();
        let store = createReportStore(history);
        sandbox.setStubFunc(ReportsListPageComponent.prototype, "render", () => (<p/>));
        sandbox.setStub(ReportsService.prototype, "getAllReports");

        mount(<Provider store={store}><ReportsListPage /></Provider>);

        setTimeout(() => {
            const state = store.getState() as ReportAppState;
            const breadcrumbs = state.breadcrumbs.breadcrumbs;
            expect(breadcrumbs[0].name).to.equal("Main menu")
            expect(breadcrumbs[0].url).to.equal("/")
            done();
        });
    });

    it("triggers action create breadcrumb on mount", (done: DoneCallback) => {
        let store = createMockStore({});
        sandbox.setStubFunc(ReportsListPageComponent.prototype, "render", () => (<p/>));
        sandbox.setStub(ReportsService.prototype, "getAllReports");

        mount(<Provider store={store}><ReportsListPage /></Provider>);

        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(BreadcrumbsTypeKeys.BREADCRUMBS_RECEIVED);
            done();
        });
    });
});