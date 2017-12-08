import * as React from "react";
import {expect} from "chai";
import {mount, render, shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {Alert} from "../../../../../main/shared/components/Alert";
import {ReactElement} from "react";
import {OptionSelector} from "../../../../../../../app/src/main/contrib/components/OptionSelector/OptionSelector";

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

});
