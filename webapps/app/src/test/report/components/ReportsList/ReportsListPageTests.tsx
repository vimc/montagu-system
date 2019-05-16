import * as React from "react";
import {mount, shallow} from "enzyme";
import { expect } from "chai";
import "../../../helper";

import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {
    ReportsListPage, ReportsListPageComponent,
} from "../../../../main/report/components/ReportsList/ReportsListPage";
import {PinnedReports} from "../../../../main/report/components/ReportsList/PinnedReports";
import {ReportsList} from "../../../../main/report/components/ReportsList/ReportsList";

describe("Reporting MainMenu", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders", () => {
        let store = createMockStore();
        const rendered = shallow(<ReportsListPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("has expected child components", () => {

        const rendered = shallow(<ReportsListPageComponent/>);
        expect(rendered.find(PinnedReports)).to.have.lengthOf(1);
        expect(rendered.find(ReportsList)).to.have.lengthOf(1);
    })
});