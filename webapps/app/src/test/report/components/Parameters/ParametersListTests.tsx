import * as React from "react";
import {expect} from "chai";
import {ParameterList} from "../../../../main/report/components/Parameters/ParameterList";
import {shallow} from "enzyme";

describe("ParametersList", () => {
    it("can render", () => {
        const fakeParams = {
            "nmin": "0",
            "nmax": "1000"
        };
        const rows = shallow(<ParameterList {...fakeParams}/>).find(".row");
        expect(rows).to.have.length(3); // 1 row for the section title, 2 for the parameters
        expect(rows.at(1).text()).to.eq("nmin: 0");
        expect(rows.at(2).text()).to.eq("nmax: 1000");
    });

    it("render nothing if no params", () => {
        const rendered = shallow(<ParameterList {...{}}/>);
        expect(rendered.html()).to.be.null;
    });
});