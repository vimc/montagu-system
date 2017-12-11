import * as React from "react";
import {expect} from "chai";
import {mount, shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {OptionSelector} from "../../../../../main/contrib/components/OptionSelector/OptionSelector";
import {Form} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/Form";

describe("CreateEstimatesFormComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders type details input", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />);
        const details = rendered.find('input[name="details"]');

        expect(details).to.have.lengthOf(1);
    });

    it("updates type details on change", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />);
        const details = rendered.find('input[name="details"]');

        details.simulate("change", { target: { value: "some value"}});

        expect(rendered.state().type.details).to.eql("some value");
    });

    it("passes through type to form", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />);

        rendered.setState({type: {type: "central-averaged", details: "some details"}});

        const form = rendered.find(Form);

        expect(form.prop("data")).to.eql({type: {type: "central-averaged", details: "some details"}});
    });

    it("renders type code select", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = mount(<CreateBurdenEstimateSetForm {...props} />);

        const select = rendered.find(OptionSelector);

        expect(select.prop("name")).to.eql("typeCode");
        expect(select.prop("defaultOption")).to.eql("-- Please select one --");
        expect(select.prop("className")).to.eql("form-control");
        expect(select.prop("required")).to.eql(true);
        expect(select.prop("options")).to.eql([{value: "central-single-run", text: "Single model run"}, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }]);

    });

    it("updates type code on change", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = mount(<CreateBurdenEstimateSetForm {...props} />);

        CreateBurdenEstimateSetForm.prototype.onTypeChange.bind(rendered)("central-averaged");

        expect(rendered.state().type.typeCode).to.eql("central-averaged");
    });

});
