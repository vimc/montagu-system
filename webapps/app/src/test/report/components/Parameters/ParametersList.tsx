import * as React from "react";
import {mount} from "enzyme";
import {expect} from "chai";
import {ParameterList} from "../../../../main/report/components/Parameters/ParameterList";

describe("ParametersList", () => {
    it("can render", () => {

        const fakeParams =
            {
                "nmin": "0",
                "nmax": "1000"
            };

        const renderedInnerDivs = mount(<ParameterList {...fakeParams}/>).find("div > div");

        expect(renderedInnerDivs.length).to.eq(2);
        expect(renderedInnerDivs.at(0).text()).to.eq("nmin : 0");
        expect(renderedInnerDivs.at(1).text()).to.eq("nmax : 1000");
    });

    it("show 'none' if no params", () => {
        const rendered = mount(<ParameterList {...{}}/>);
        expect(rendered.text()).to.eq("none");
    });

});