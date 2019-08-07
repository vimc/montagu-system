import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import { Store } from "redux";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {
    CreateBurdenEstimateSetForm,
    CreateBurdenEstimateSetFormState
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {OptionSelector} from "../../../../../main/contrib/components/OptionSelector/OptionSelector";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {createMockStore} from "../../../../mocks/mockStore";
import {estimatesActionCreators} from "../../../../../main/contrib/actions/estimatesActionCreators";

describe("Create Burden Estimates Form Component tests", () => {

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders type details input", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />, {context: {store}}).dive();
        const details = rendered.find('input[name="details"]');

        expect(details).to.have.lengthOf(1);
    });

    it("updates type details on change", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />, {context: {store}}).dive();
        const details = rendered.find('input[name="details"]');

        details.simulate("change", {target: {value: "some value"}});
        const formState = rendered.state() as CreateBurdenEstimateSetFormState;

        expect(formState.data.type.details).to.eql("some value");
    });


    it("renders type code select", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};

        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />, {context: {store}}).dive();

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
        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />, {context: {store}}).dive();

        const typeSelect = rendered.find(OptionSelector);
        typeSelect.simulate("change", "central-averaged");

        const formState = rendered.state() as CreateBurdenEstimateSetFormState;
        expect(formState.data.type.type).to.eql("central-averaged");
    });

    it("fetches estimates token and refreshes responsibilities on success", () => {
        const props = {touchstoneId: "touchstone-1", groupId: "group-1", scenarioId: "scenario-1"};
        const rendered = shallow(<CreateBurdenEstimateSetForm {...props} />, {context: {store}}).dive();

        const createBurdenStub = sandbox.setStubReduxAction(estimatesActionCreators, "createBurden");

        const form = rendered.find("form");
        form.simulate('submit', {
            preventDefault: () => {},
            target: {checkValidity: () => true}
        });
        expect(createBurdenStub.called).to.eq(true);
    });

});
