import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReport} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import ReactTable from "react-table";
import {
    PublishStatusCell, PublishStatusFilter,
    publishStatusFilterMethod
} from "../../../../../main/report/components/ReportsList/ReportListColumns/PublishStatusColumn";
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

        it("renders options to filter by status", function () {
            const onChange = sandbox.sinon.stub();
            const result = shallow(<PublishStatusFilter onChange={onChange}/>);
            expect(result.find("option").map(o => o.prop("value"))).to.have.members(["all", "published", "internal"])
        });

        it("filters reports by status", function () {
            let row = {
                published: true
            };

            let filter = {value: "published"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "published reports should show if filter is set to 'published'").to.be.true;

            filter = {value: "all"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "published reports should show if filter is set to 'all'").to.be.true;

            filter = {value: "internal"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "published reports should not show if filter is set to 'internal'").to.be.false;

            row = {
                published: false
            };

            filter = {value: "internal"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "internal reports should show if filter is set to 'internal'").to.be.true;

            filter = {value: "all"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "internal reports should show if filter is set to 'all'").to.be.true;

            filter = {value: "published"};

            expect(publishStatusFilterMethod(filter as any, row as any),
                "internal reports should not show if filter is set to 'published'").to.be.false;
        });
    });

});