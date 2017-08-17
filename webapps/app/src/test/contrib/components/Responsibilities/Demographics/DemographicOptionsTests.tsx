import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { DemographicOptions } from "../../../../../main/contrib/components/Responsibilities/Demographics/DemographicOptions";
import { mockDemographicStatisticType } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { expectOneAction } from "../../../../actionHelpers";
import { GenderControl } from "../../../../../main/contrib/components/Responsibilities/Demographics/GenderControl";
import { demographicStore } from "../../../../../main/contrib/stores/DemographicStore";

describe("DemographicOptions", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    function getStatisticType(rendered: ShallowWrapper<any, any>) {
        return rendered.find("table").find("tr").at(0).find("select");
    }
    function getGender(rendered: ShallowWrapper<any, any>) {
        return rendered.find("table").find("tr").at(2).find(GenderControl);
    }

    it("renders statistic type options", () => {
        const sets = [
            mockDemographicStatisticType({ id: "a", name: "AA" }),
            mockDemographicStatisticType({ id: "b", name: "BB" })
        ];
        const rendered = shallow(<DemographicOptions
            dataSets={sets} selectedDataSet={null} selectedGender="" selectedSource="" />);
        const options = getStatisticType(rendered).find("option");
        expect(options.map(x => {
            return {
                value: x.prop("value"),
                text: x.children().text()
            };
        })).to.eql([
            { value: "", text: "- Select -" },
            { value: "a", text: "AA" },
            { value: "b", text: "BB" },
        ]);
    });

    it("selected statistic type is selected", () => {
        const setA = mockDemographicStatisticType({ id: "a" });
        const setB = mockDemographicStatisticType({ id: "b" });
        const rendered = shallow(<DemographicOptions
            dataSets={[setA, setB]} selectedDataSet={setB} selectedGender="" selectedSource=""/>);
        expect(getStatisticType(rendered).prop("value")).to.equal("b");
    });

    it("renders gender control", () => {
        const setA = mockDemographicStatisticType({ id: "a"});
        const setB = mockDemographicStatisticType({ id: "b" });
        const rendered = shallow(<DemographicOptions
            dataSets={[setA, setB]} selectedDataSet={setA} selectedGender="x" selectedSource="" />);
        const control = getGender(rendered);
        expect(control.prop("dataSet")).to.equal(setA);
        expect(control.prop("value")).to.equal("x");
    });

    it("emits action when statistic type is selected", () => {
        const spy = sandbox.dispatchSpy();
        const fetchOneTimeToken = sandbox.sinon.stub(demographicStore, "fetchOneTimeToken").returns(Promise.resolve(true));
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={null} selectedGender="" selectedSource=""/>);
        getStatisticType(rendered).simulate("change", { target: { value: "a" } });
        expectOneAction(spy, { action: "DemographicActions.selectDataSet", payload: "a" });
        expect(fetchOneTimeToken.called).to.be.true;
    });

    it("emits action when gender is selected", () => {
        const spy = sandbox.dispatchSpy();
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={null} selectedGender="" selectedSource=""/>);
        getGender(rendered).simulate("selectGender", "x");
        expectOneAction(spy, { action: "DemographicActions.selectGender", payload: "x" });
    });
});
