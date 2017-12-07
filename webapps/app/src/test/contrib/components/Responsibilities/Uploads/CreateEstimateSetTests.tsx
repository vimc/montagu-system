import * as React from "react";
import {expect} from "chai";
import {mount, render, shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {Alert} from "../../../../../main/shared/components/Alert";
import {ReactElement} from "react";

describe("CreateEstimatesFormComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("sets the type details", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />);
        rendered.find('input[name="details"]').simulate("change", {target: {value: "test value"}});

        expect(rendered.state().typeDetails).to.eq("test value")
    });

    it("sets the type code", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = mount(<CreateBurdenEstimateSetForm {...props} />);

        // mutate underlying node, as the simulate event doesn't pass through args as expected on
        // select elements
        // https://github.com/airbnb/enzyme/issues/389
        (rendered.find('select').getNode() as any).selectedIndex = 2;

        rendered.find('select').simulate("change", "central-averaged");

        expect(rendered.state().typeCode).to.equal("central-averaged")
    });

    it("shows errors", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = mount(<CreateBurdenEstimateSetForm {...props} />);
        const errors = [{code: "err", message: "err message"}];

        rendered.setState({errors: errors});

        expect(rendered.find(Alert).last().prop("hasError")).to.eq(true);
        expect(rendered.find(Alert).last().prop("hasSuccess")).to.eq(false);
    });

    it("shows success", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = mount(<CreateBurdenEstimateSetForm {...props} />);
        const errors = [{code: "err", message: "err message"}];

        rendered.setState({hasSuccess: true});

        expect(rendered.find(Alert).last().prop("hasSuccess")).to.eq(true);
        expect(rendered.find(Alert).last().prop("hasError")).to.eq(false);
    });


});
