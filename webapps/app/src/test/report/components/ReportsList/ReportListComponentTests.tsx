import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import { mockReport } from "../../../mocks/mockModels";
import {ReportsListComponent} from "../../../../main/report/components/ReportsList/ReportsListComponent";
import {mapStateToProps} from "../../../../main/report/components/ReportsList/ReportsList";
import {ReportListItem} from "../../../../main/report/components/ReportsList/ReportListItem";
import {mockReportAppState} from "../../../mocks/mockStates";

describe("ReportListComponent", () => {
    it("can render two reports", () => {
        const reports = [ mockReport(), mockReport() ];
        const rendered = shallow(<ReportsListComponent reports={ reports } />);
        const items = rendered.find(ReportListItem);
        expect(items).to.have.length(2);
    });

    it("renders no items if no reports given", () => {
       const rendered = shallow(<ReportsListComponent reports={ [] } />);
        const items = rendered.find(ReportListItem);
        expect(items).to.have.length(0);
    });
});