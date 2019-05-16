import * as React from "react";
import {expect} from "chai";
import {mount, shallow} from "enzyme";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {
    mapDispatchToProps,
    UploadBurdenEstimatesForm,
    UploadBurdenEstimatesFormComponent,
    UploadBurdenEstimatesFormComponentProps, UploadBurdenEstimatesFormPublicProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {helpers} from "../../../../../main/shared/Helpers";
import {Alert} from "reactstrap"
import {mockBurdenEstimateSet} from "../../../../mocks/mockModels";
import {PopulateEstimatesForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/PopulateBurdenEstimatesForm";
import {mockContribState} from "../../../../mocks/mockStates";
import {createMockContribStore} from "../../../../mocks/mockStore";
import {estimatesActionCreators} from "../../../../../main/contrib/actions/estimatesActionCreators";

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
            hasSuccess: false,
            errors: [],
            resetPopulateState: () => {
            }
        };

        const rendered = shallow(<UploadBurdenEstimatesFormComponent {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(1);
        expect(rendered.find(PopulateEstimatesForm)).to.have.lengthOf(0);
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

            hasSuccess: false,
            errors: [],
            resetPopulateState: () => {
            }
        };

        const rendered = shallow(<UploadBurdenEstimatesFormComponent {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        const form = rendered.find(PopulateEstimatesForm);
        expect(form).to.have.lengthOf(1);
        expect(form.prop("groupId")).to.equal("group-1");
        expect(form.prop("touchstoneId")).to.equal("touchstone-1");
        expect(form.prop("scenarioId")).to.equal("scenario-1");
        expect(form.prop("setId")).to.equal(set.id);

    });

    it("does not render forms if can not upload or create", () => {

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
            hasSuccess: false,
            errors: [],
            resetPopulateState: () => {
            }
        };

        const rendered = shallow(<UploadBurdenEstimatesFormComponent {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(PopulateEstimatesForm)).to.have.lengthOf(0);
    });

    it("shows alert", () => {

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
            hasSuccess: false,
            errors: [],
            resetPopulateState: () => {
            }
        };

        const rendered = shallow(<UploadBurdenEstimatesFormComponent {...props} />);

        expect(rendered.find(CreateBurdenEstimateSetForm)).to.have.lengthOf(0);
        expect(rendered.find(PopulateEstimatesForm)).to.have.lengthOf(0);
    });

    it("displays errors if present", () => {

        const props: UploadBurdenEstimatesFormPublicProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false
        };

        const store = createMockContribStore(mockContribState({
            estimates: {
                populateErrors: [{
                    code: "e",
                    message: "error message"
                }]
            }
        }));

        const rendered = mount(<UploadBurdenEstimatesForm{...props} />, {context: {store}});

        const alert = rendered.find(Alert).first();
        expect(alert.prop("color")).to.eq("danger");
        expect(alert.find("p").hasClass("render-whitespace")).to.eq(true);
        expect(alert.find("p").text()).to.eql("error message");
        expect(alert.text()).to.contain("Please correct the data and re-upload");
    });

    it("displays success message if present", () => {

        const props: UploadBurdenEstimatesFormPublicProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
        };

        const store = createMockContribStore(mockContribState({estimates: {hasPopulateSuccess: true}}));

        const rendered = mount(<UploadBurdenEstimatesForm {...props} />, {context: {store}});

        const alert = rendered.find(Alert).last();
        expect(alert.props().color).to.eq("success");
        expect(alert.childAt(0).text()).to.contain("Success! You have uploaded a new set of burden estimates");
    });


    it("does not display success message if not presnet", () => {

        const props: UploadBurdenEstimatesFormPublicProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
        };

        const store = createMockContribStore(mockContribState());

        const rendered = mount(<UploadBurdenEstimatesForm {...props} />, {context: {store}});

        const alert = rendered.find(Alert).last();
        expect(alert.props().color).to.eq("success");
        expect(alert.props().isOpen).to.be.false;
    });

    it("resets populate state when error alert is closed", () => {

        const resetStateStub = sandbox.sinon.stub();
        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
            hasSuccess: true,
            errors: [],
            resetPopulateState: resetStateStub
        };

        const rendered = mount(<UploadBurdenEstimatesFormComponent {...props} />);

        const alert = rendered.find(Alert).first();
        alert.props().toggle.call();

        expect(resetStateStub.called).to.be.true;
    });

    it("resets populate state when success alert is closed", () => {

        const resetStateStub = sandbox.sinon.stub();

        const props: UploadBurdenEstimatesFormComponentProps = {
            groupId: "group-1",
            touchstoneId: "touchstone-1",
            scenarioId: "scenario-1",
            estimateSet: null,
            canUpload: false,
            canCreate: false,
            hasSuccess: true,
            errors: [],
            resetPopulateState: resetStateStub
        };

        const rendered = mount(<UploadBurdenEstimatesFormComponent {...props} />);

        const alert = rendered.find(Alert).last();
        alert.props().toggle.call();

        expect(resetStateStub.called).to.be.true;
    });

    it("can dispatch resetPopulateState", () => {
        const dispatchStub = sandbox.sinon.stub();
        sandbox.setStubFunc(estimatesActionCreators, "resetPopulateState", () => "TEST");

        const result = mapDispatchToProps(dispatchStub, {} as any);
        result.resetPopulateState();

        expect(dispatchStub.calledWith("TEST")).to.be.true;
    })
});