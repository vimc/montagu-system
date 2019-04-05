import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";

import {ReportsListTable} from "../../../../../main/report/components/ReportsList/ReportListTable";
import {mockReportVersion} from "../../../../mocks/mockModels";
import ReactTable from "react-table";

describe("ReportListTable", () => {

    it("sorts reports by latest version descending", () => {

        const reports = [
            mockReportVersion({name: "r1", display_name: "r1", date: new Date(2017, 5, 1).toDateString()}),
            mockReportVersion({name: "r3", display_name: "r3", date: new Date(2018, 10, 1).toDateString()}),
            mockReportVersion({name: "r2", display_name: "r2", date: new Date(2017, 9, 1).toDateString()}),
            mockReportVersion({name: "r2", display_name: "r2", date: new Date(2018, 1, 1).toDateString()})
        ];

        const rendered = mount(<ReportsListTable reports={reports} isReviewer={false}/>);

        const cells = rendered.find(ReactTable).find(".rt-td.rt-expandable.rt-pivot");

        const firstDataCell = cells.at(0);
        expect(firstDataCell.find(".name").text()).to.eq("r3");
        expect(firstDataCell.find(".text-muted.ml-4").text()).to.eq("1 version: ");

        const secondDataCell = cells.at(1);
        expect(secondDataCell.find(".name").text()).to.eq("r2");
        expect(secondDataCell.find(".text-muted.ml-4").text()).to.eq("2 versions: ");

        const thirdDataCell = cells.at(2);
        expect(thirdDataCell.find(".name").text()).to.eq("r1");
        expect(thirdDataCell.find(".text-muted.ml-4").text()).to.eq("1 version: ");

    });
});
