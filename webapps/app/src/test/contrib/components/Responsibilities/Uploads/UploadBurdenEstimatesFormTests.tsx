import * as React from "react";
import {expect} from "chai";
import {
    mockBurdenEstimateSet,
    mockModellingGroup, mockResponsibility, mockScenario,
    mockTouchstone
} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import {findLabelledCell} from "../../../../TableHelpers";
import {Sandbox} from "../../../../Sandbox";
import {
    UploadBurdenEstimatesContentComponent,
    UploadBurdenEstimatesContentComponentProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesContent";
import {UploadFileForm} from "../../../../../main/shared/components/UploadFileForm";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "../../../../../../../app/src/main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {helpers} from "../../../../../../../app/src/main/shared/Helpers";
import {Alert} from "../../../../../../../app/src/main/shared/components/Alert";

describe("UploadEstimatesForm", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders create form if canCreate and not canUpload", () => {

        const props = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            canUpload: false,
            canCreate: true,
            estimatesToken: "TOKEN"
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(1);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(0);
    });

    it("renders upload form if canUpload", () => {

        const props = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            canUpload: true,
            canCreate: true,
            estimatesToken: "TOKEN"
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(1);
    });

    it("does not render forms if can not upload or create", () => {

        const props = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            canUpload: false,
            canCreate: false,
            estimatesToken: "TOKEN"
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(0);
    });

    it("shows alert", () => {

        const props = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            canUpload: false,
            canCreate: false,
            estimatesToken: "TOKEN"
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(UploadFileForm)).to.have.lengthOf(0);
    });

    it("does not show alert", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns(null);

        const props = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            canUpload: false,
            canCreate: false,
            estimatesToken: "TOKEN"
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        const alert = rendered.find(Alert);
        expect(alert.prop("hasError")).to.eq(false);
        expect(alert.prop("hasSuccess")).to.eq(false);

    });

    it("ingests query string and displays error", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "failure",
            errors: [{code: "code", message: "error message"}],
            data: null
        });

        const props = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            canUpload: false,
            canCreate: false,
            estimatesToken: "TOKEN"
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        const alert = rendered.find(Alert).first();
        expect(alert.prop("hasError")).to.eq(true);
        expect(alert.prop("hasSuccess")).to.eq(false);
        expect(alert.prop("message")).to.eql("error message");
    });

    it("ingests query string and displays success message", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "success",
            errors: [],
            data: "OK"
        });

        const props = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            canUpload: false,
            canCreate: false,
            estimatesToken: "TOKEN"
        };

        const rendered = shallow(<UploadBurdenEstimatesForm {...props} />);

        const alert = rendered.find(Alert).first();
        expect(alert.prop("hasSuccess")).to.eq(true);
        expect(alert.prop("hasError")).to.eq(false);
        expect(alert.prop("message")).to.eql("Success! You have uploaded a new set of burden estimates");
    });


});