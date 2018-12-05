import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {UploadFileForm} from "../../../../../main/shared/components/UploadFileForm";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {
    UploadBurdenEstimatesForm,
    UploadBurdenEstimatesFormComponentProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {helpers} from "../../../../../main/shared/Helpers";
import {Alert} from "reactstrap"
import {mockBurdenEstimateSet} from "../../../../mocks/mockModels";

describe("UploadEstimatesForm", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders create form if canCreate and not canUpload", () => {

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: true,
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(1);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(0);
    });

    it("renders upload form if canUpload", () => {
        sandbox.setStubFunc(helpers, "getCurrentLocation", () => "/some-url/");
        const set = mockBurdenEstimateSet({id: 123});
        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: set,
            canUpload: true,
            canCreate: true,
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        const form = rendered.find(UploadFileForm);
        expect(form).to.have.lengthOf(1);
        expect(form.prop("href")).to.equal(
            "/modelling-groups/group-1/responsibilities/touchstone-1/scenario-1/estimate-sets/123/?redirectResultTo=%2Fsome-url%2F"
        );
    });


    it("does not render forms after successful upload", () => {

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: true,
        };

        sandbox.setStub(helpers, "ingestQueryStringAndReturnResult")
            .returns({status: "success", data: null, errors: []});

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(0);
    });

    it("does not render forms if can not upload or create", () => {

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(0);
    });

    it("shows alert", () => {

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(0);
    });

    it("does not show alert", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns(null);

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        const alerts = rendered.find(Alert);
        expect(alerts).to.have.lengthOf(2);
        expect(alerts.first().prop("isOpen")).to.eq(false);
        expect(alerts.last().prop("isOpen")).to.eq(false);

    });

    it("ingests query string and displays error", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "failure",
            errors: [{code: "code", message: "error message"}],
            data: null
        });

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        const alert = rendered.find(Alert).first();
        expect(alert.prop("color")).to.eq("danger");
        expect(alert.childAt(0).text()).to.eql("error message");
        expect(alert.childAt(0).hasClass("render-whitespace")).to.eq(true);
        expect(alert.html().includes("Please correct the data and re-upload")).to.eq(true);
    });

    it("ingests query string and displays success message", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "success",
            errors: [],
            data: "OK"
        });

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        const alert = rendered.find(Alert).last();
        expect(alert.prop("color")).to.eq("success");
        expect(alert.childAt(0).text()).to.eql("Success! You have uploaded a new set of burden estimates");
    });
});