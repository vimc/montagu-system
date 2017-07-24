import * as React from "react";
import { shallow } from "enzyme";
import {ReportListItem} from "../../../main/report/components/Reports/ReportListItem";


describe("ReportListItem", () => {
    it("can render", () => {
        shallow(<ReportListItem name={ "test" } />);
    });

});