import * as React from "react";
import {expect} from "chai";
import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {
    initialUploadState,
    PopulateEstimatesFormComponent
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/PopulateBurdenEstimatesForm";
import {shallow} from "enzyme";
import {EventEmitter} from "events";
import {Alert} from "reactstrap";

describe("Populate Burden Estimates Form Component tests", () => {

    const sandbox = new Sandbox();

    class FakeUploadClient extends EventEmitter {
        assignBrowse() {

        }

        progress() {
            return 0.27
        }

        cancel() {

        }
    }

    const fakeUploadClient = new FakeUploadClient();
    const nullFunction = () => {
    };

    beforeEach(() => {
        sandbox.sinon.stub(window, "fetch");
    });

    const getComponent = (props: any = {}) => {
        return shallow(<PopulateEstimatesFormComponent
            createUploadClient={() => fakeUploadClient as any}
            getUploadToken={props.getUploadToken || nullFunction}
            populateEstimateSet={props.populateEstimateSet || nullFunction}
            hasPopulateSuccess={props.hasPopulateSuccess || false}
            populateErrors={[]}
            resetPopulateState={() => {
            }}
            url={"/url"}
            uploadToken={"TOKEN"}
            populatingInProgress={false}
            touchstoneId={"1"}
            scenarioId={"1"}
            groupId={"1"}
            setId={1}/>);
    };

    it("validates file and gets upload token if valid", () => {

        const getUploadToken = sandbox.sinon.stub();
        const result = getComponent({getUploadToken});

        fakeUploadClient.emit("fileAdded", {fileName: "wrongfile.png"});
        expect(result.state().validationResult.isValid).to.be.false;
        expect(getUploadToken.called).to.be.false;
        expect(result.find(Alert).filterWhere((alert) => alert.props().isOpen)).to.have.lengthOf(0);

        fakeUploadClient.emit("fileAdded", {fileName: "goodfile.csv"});
        expect(result.state().validationResult.isValid).to.be.true;
        expect(getUploadToken.called).to.be.true;
        expect(result.find(Alert).filterWhere((alert) => alert.props().isOpen)).to.have.lengthOf(0);

    });

    it("shows progress bar on file upload progress", () => {

        const result = getComponent();

        fakeUploadClient.emit("progress");
        expect(result.state().isUploading).to.be.true;
        expect(result.find(".progress").first().props().style).to.have.property("display", "block");
        const progressBar = result.find(".progress-bar").first();
        expect(progressBar.props().style).to.have.property("width", "30%");
        expect(progressBar.props().className).to.eq("progress-bar bg-success");

        const uploadButton = result.find(".submit.start").first();
        expect(uploadButton.props().disabled).to.be.true;

    });

    it("resets local state on file upload success", () => {

        const result = getComponent();
        result.setState({
            isUploading: true,
            file: {fileName: "test.csv"},
            uploadErrors: ["something"],
            progress: 10
        });

        fakeUploadClient.emit("fileSuccess");

        const newState = result.state();

        expect(newState.isUploading).to.be.false;
        expect(newState.progress).to.eq(0);
        expect(newState.uploadErrors).to.have.lengthOf(0);

        // it should retain the current file though
        expect(newState.file.fileName).to.eq("test.csv")
    });

    it("shows success message on file population success", () => {

        const result = getComponent({hasPopulateSuccess: true});
        fakeUploadClient.emit("fileSuccess");

        const successAlert = result.find(Alert).filterWhere((alert) => alert.props().color == "success");
        expect(successAlert.props().isOpen).to.be.true;
    });

    it("populates estimates on file upload success", () => {

        const populateEstimateSet = sandbox.sinon.stub();
        getComponent({populateEstimateSet});

        fakeUploadClient.emit("fileSuccess");
        expect(populateEstimateSet.called).to.be.true;
    });

    it("shows Montagu errors on file upload error", () => {

        const result = getComponent();
        fakeUploadClient.emit("fileError", {}, JSON.stringify({
            data: null,
            success: "failure",
            errors: [{code: "e", message: "test error"}]
        }));

        const allOpenAlerts = result.find(Alert).filterWhere((alert) => alert.props().isOpen);
        expect(allOpenAlerts).to.have.lengthOf(1);

        const errorAlert = result.find(Alert).filterWhere((alert) => alert.props().id == "upload-errors")
            .childAt(0);

        expect(errorAlert.text()).to.eq("test error");
    });

    it("shows arbitrary errors on file upload error", () => {

        const result = getComponent();
        fakeUploadClient.emit("fileError", "someerror");

        const allOpenAlerts = result.find(Alert).filterWhere((alert) => alert.props().isOpen);
        expect(allOpenAlerts).to.have.lengthOf(1);

        const errorAlert = result.find(Alert).filterWhere((alert) => alert.props().id == "upload-errors")
            .childAt(0);
        expect(errorAlert.text()).to.eq("Error contacting server");
    });


    it("resets local state and removes file on cancel", () => {

        const result = getComponent();
        result.setState({
            isUploading: true,
            file: {fileName: "test.csv"},
            uploadErrors: ["something"],
            progress: 10
        });

        result.find(".cancel").simulate("click");
        expect(result.state()).to.deep.eq(initialUploadState)

    });

});