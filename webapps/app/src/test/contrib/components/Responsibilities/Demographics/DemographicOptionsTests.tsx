import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { DemographicOptions } from "../../../../../main/contrib/components/Responsibilities/Demographics/DemographicOptions";
import { mockDemographicStatisticType } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { expectOneAction } from "../../../../actionHelpers";
import { GenderControl } from "../../../../../main/contrib/components/Responsibilities/Demographics/GenderControl";
import { demographicStore } from "../../../../../main/contrib/stores/DemographicStore";
import { SourceControl } from "../../../../../main/contrib/components/Responsibilities/Demographics/SourceControl";

describe("DemographicOptions", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    function findRowByLabel(rendered: ShallowWrapper<any, any>, label: string) {
        return rendered.find("table").find(`td[children="${label}"]`).parent();
    }

    function getStatisticType(rendered: ShallowWrapper<any, any>) {
        return findRowByLabel(rendered, "Statistic type").find("select");
    }
    function getSource(rendered: ShallowWrapper<any, any>) {
        return findRowByLabel(rendered, "Source").find(SourceControl);
    }
    function getGender(rendered: ShallowWrapper<any, any>) {
        return findRowByLabel(rendered, "Gender").find(GenderControl);
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

    it("renders source control", () => {
        const set = mockDemographicStatisticType({ sources: ["s1", "s2"] });
        const rendered = shallow(<DemographicOptions
            dataSets={[set]} selectedDataSet={set} selectedGender="x" selectedSource="s2" />);
        const control = getSource(rendered);
        expect(control.props()).to.eql({
            dataSet: set,
            selected: "s2",
            onSelectSource: (rendered.instance() as DemographicOptions).onSelectSource
        });
    });

    it("hides source control when there is only one source", () => {
        const set = mockDemographicStatisticType({ sources: ["s1"] });
        const rendered = shallow(<DemographicOptions
            dataSets={[set]} selectedDataSet={set} selectedGender="x" selectedSource="s2" />);
        const control = getSource(rendered);
        expect(control).to.have.length(0);
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
        const fetchOneTimeToken = sandbox.stubFetch(demographicStore, "fetchOneTimeToken");
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={null} selectedGender="" selectedSource=""/>);
        getStatisticType(rendered).simulate("change", { target: { value: "a" } });
        expectOneAction(spy, { action: "DemographicActions.selectDataSet", payload: "a" });
        expect(fetchOneTimeToken.called).to.be.true;
    });

    it("emits action when source is selected", () => {
        const spy = sandbox.dispatchSpy();
        const fetchOneTimeToken = sandbox.stubFetch(demographicStore, "fetchOneTimeToken");
        const set = mockDemographicStatisticType();
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={set} selectedGender="" selectedSource=""/>);
        getSource(rendered).simulate("selectSource", { target: { value: "x" } });
        expectOneAction(spy, { action: "DemographicActions.selectSource", payload: "x" });
        expect(fetchOneTimeToken.called).to.be.true;
    });

    it("emits action when gender is selected", () => {
        const spy = sandbox.dispatchSpy();
        const fetchOneTimeToken = sandbox.stubFetch(demographicStore, "fetchOneTimeToken");
        const rendered = shallow(<DemographicOptions
            dataSets={[]} selectedDataSet={null} selectedGender="" selectedSource=""/>);
        getGender(rendered).simulate("selectGender", "x");
        expectOneAction(spy, { action: "DemographicActions.selectGender", payload: "x" });
        expect(fetchOneTimeToken.called).to.be.true;
    });
});
