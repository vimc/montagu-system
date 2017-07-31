import * as React from "react";
import {expect} from "chai";
import {ParameterList} from "../../../../main/report/components/Parameters/ParameterList";
import { Sandbox } from "../../../Sandbox";

describe("ParametersList", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("can render", () => {

        const fakeParams =
            {
                "nmin": "0",
                "nmax": "1000"
            };

        const renderedInnerDivs = sandbox.mount(<ParameterList {...fakeParams}/>).find("div > div");

        expect(renderedInnerDivs.length).to.eq(2);
        expect(renderedInnerDivs.at(0).text()).to.eq("nmin : 0");
        expect(renderedInnerDivs.at(1).text()).to.eq("nmax : 1000");
    });

    it("show 'none' if no params", () => {
        const rendered = sandbox.mount(<ParameterList {...{}}/>);
        expect(rendered.text()).to.eq("none");
    });

});