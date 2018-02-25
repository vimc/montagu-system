import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import "../../../helper";
import {ReportsListSortingComponent} from "../../../../main/report/components/ReportsList/ReportsListSorting";
import {Sandbox} from "../../../Sandbox";

describe("ReportListSorting", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    // it("can render select with 3 elements", () => {
    //     const rendered = shallow(<ReportsListSortingComponent sort={()=>{}} />);
    //     const items = rendered.find('option');
    //     expect(items).to.have.length(2);
    // });
    //
    // it("triggers sort on select change", () => {
    //     const sortSpy = sandbox.createSpy();
    //     const rendered = shallow(<ReportsListSortingComponent sort={sortSpy} />);
    //     const items = rendered.find('select').simulate('change', {target: { value : 'name'}});
    //     expect(sortSpy.called).is.equal(true);
    //     expect(sortSpy.getCall(0).args).is.eql(["name"]);
    // });

});