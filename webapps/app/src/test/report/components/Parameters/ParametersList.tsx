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

        const first = renderedInnerDivs.at(0);
        expect(first.text()).to.eq("nmin : 0");

        const second = renderedInnerDivs.at(1);
        expect(second.text()).to.eq("nmax : 1000");
    });

    it("show 'none' if no params", () => {


        const rendered = mount(<ParameterList {...{}}/>);

        expect(rendered.text()).to.eq("none");
    });

});