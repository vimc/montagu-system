import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReport} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import ReactTable from "react-table";
import {PublishStatusCell} from "../../../../../main/report/components/ReportsList/ReportListColumns/PublishStatusColumn";
import {ReportsListTable} from "../../../../../main/report/components/ReportsList/ReportListTable";

describe("ReportListComponent", () => {

    const sandbox = new Sandbox();

    beforeEach(function () {
        sandbox.restore();
    });

    describe("PublishStatusColumn", () => {

        it("is not included if isReviewer is false", function () {
            const result = shallow(<ReportsListTable isReviewer={false} reports={[]}/>);
            expect(result.find(ReactTable).prop("columns").some(c => c.Header == "Status")).to.be.false;
        });

        it("is included if isReviewer is true", function () {
            const result = shallow(<ReportsListTable isReviewer={true} reports={[]}/>);
            expect(result.find(ReactTable).prop("columns").some(c => c.Header == "Status")).to.be.true;
        });

        it("renders published badge", function () {
            const result = shallow(<PublishStatusCell original={mockReport()} value={true}/>);
            expect(result.find(".badge-published")).to.have.lengthOf(1);
        });

        it("renders internal badge", function () {
            const result = shallow(<PublishStatusCell original={mockReport()} value={false}/>);
            expect(result.find(".badge-internal")).to.have.lengthOf(1);
        });

    });

});