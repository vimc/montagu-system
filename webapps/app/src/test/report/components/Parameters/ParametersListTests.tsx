import * as React from "react";
import {expect} from "chai";
import {ParameterList} from "../../../../main/report/components/Parameters/ParameterList";
import {shallow} from "enzyme";
import {ILookup, makeLookup} from "../../../../main/shared/models/Lookup";

describe("ParametersList", () => {
    it("can render", () => {
        const fakeParams = {
            "nmin": "0",
            "nmax": "1000"
        } as Readonly<ILookup<string>>;
        const rows = shallow(<ParameterList {...fakeParams}/>).find(".row");
        expect(rows).to.have.length(2);
        expect(rows.at(0).text()).to.eq("nmin: 0");
        expect(rows.at(1).text()).to.eq("nmax: 1000");
    });

    it("render nothing if no params", () => {
        const rendered = shallow(<ParameterList {...makeLookup([])}/>);
        expect(rendered.html()).to.be.null;
    });
});