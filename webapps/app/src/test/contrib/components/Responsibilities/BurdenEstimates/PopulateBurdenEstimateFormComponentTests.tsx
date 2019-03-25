import * as React from "react";
import {expect} from "chai";
import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {
    initialUploadState,
    PopulateEstimatesFormComponent,
    SelectedFile,
    UploadEstimatesState
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/PopulateBurdenEstimatesForm";
import {mount, shallow} from "enzyme";
import {EventEmitter} from "events";
import {Alert} from "reactstrap";

describe("Populate Burden Estimates Form Component tests", () => {

    const sandbox = new Sandbox();

    class FakeUploadClient extends EventEmitter {
        cancelled: boolean;
        uploadStarted: boolean;

        assignBrowse() {

        }

        progress() {
            return 0.27
        }

        cancel() {
            this.cancelled = true;
        }

        upload() {
            this.uploadStarted = true
        }
    }

    let fakeUploadClient = new FakeUploadClient();
    const nullFunction = () => {
    };

    beforeEach(() => {
        sandbox.sinon.stub(window, "fetch");
        fakeUploadClient = new FakeUploadClient();
    });

    afterEach(() => {
        sandbox.restore();
    });

    const getComponent = (props: any = {}) => {
        return shallow(<PopulateEstimatesFormComponent
            createUploadClient={() => fakeUploadClient as any}
            getUploadToken={props.getUploadToken || nullFunction}
            populateEstimateSet={props.populateEstimateSet || nullFunction}
            hasPopulateSuccess={props.hasPopulateSuccess || false}
            populateErrors={[]}
            resetPopulateState={props.resetPopulateState || nullFunction}
            url={props.url || "/url"}
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

        fakeUploadClient.emit("fileAdded", {fileName: "goodfile.csv"});
        expect(result.state().validationResult.isValid).to.be.true;
        expect(getUploadToken.called).to.be.true;
    });

    describe("selected file component", () => {

        it("shows file if valid", () => {
            const state: UploadEstimatesState = {
                ...initialUploadState,
                file: {fileName: "test.csv"} as any,
                validationResult: {isValid: true} as any
            };

            const result = mount(<SelectedFile {...state} />);

            expect(result.childAt(0).childAt(0).text()).to.eq("File selected: test.csv");
            expect(result.find(Alert).props().isOpen).to.be.false;
        });

        it("shows error if invalid", () => {
            const state: UploadEstimatesState = {
                ...initialUploadState,
                file: {fileName: "test.csv"} as any,
                validationResult: {isValid: false, content: "some error"} as any
            };

            const result = mount(<SelectedFile {...state} />);

            expect(result.childAt(0).childAt(0).text()).to.eq("File selected: test.csv");
            expect(result.find(Alert).props().isOpen).to.be.true;
            expect(result.find(Alert).childAt(0).text()).to.eq("some error");
        });

        it("shows nothing if no file selected", () => {

            const result = mount(<SelectedFile {...initialUploadState} />);
            expect(result.children()).to.have.lengthOf(0);
        });

    });

    it("file upload is disabled if url is null", () => {

        const result = shallow(<PopulateEstimatesFormComponent
            createUploadClient={() => fakeUploadClient as any}
            getUploadToken={nullFunction}
            populateEstimateSet={ nullFunction}
            hasPopulateSuccess={false}
            populateErrors={[]}
            resetPopulateState={nullFunction}
            url={null}
            uploadToken={"TOKEN"}
            populatingInProgress={false}
            touchstoneId={"1"}
            scenarioId={"1"}
            groupId={"1"}
            setId={1}/>);

        result.setState({file: {fileName: "test.csv"}});

        expect(result.find(".submit").props().disabled).to.be.true;
    });

    it("file upload is disabled if file is null", () => {

        const result = getComponent();

        expect(result.find(".submit").props().disabled).to.be.true;
    });

    it("file upload is disabled if file is invalid", () => {

        const result = getComponent();
        result.setState({file: {fileName: "test.csv"}, validationResult: {isValid: false}});

        expect(result.find(".submit").props().disabled).to.be.true;
    });

    it("file upload is disabled while uploading is in progress", () => {

        const result = getComponent();
        result.setState({isUploading: true});

        expect(result.find(".submit").props().disabled).to.be.true;
    });

    it("starts file upload", () => {

        const resetPopulateState = sandbox.sinon.stub();
        const result = getComponent({resetPopulateState: resetPopulateState});
        result.setState({
            file: {fileName: "test.csv"}
        });
        result.find(".submit").simulate("click");
        expect(resetPopulateState.called).to.be.true;
        expect(result.state().isUploading).to.be.true;
        expect(fakeUploadClient.uploadStarted).to.be.true;
    });

    it("shows progress bar on file upload progress", () => {

        const result = getComponent();
        fakeUploadClient.emit("progress");
        expect(result.state().isUploading).to.be.true;
        expect(result.find(".progress").first().props().style).to.have.property("display", "block");
        const progressBar = result.find(".progress-bar").first();
        expect(progressBar.props().style).to.have.property("width", "27%");
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
        expect(result.state()).to.deep.eq(initialUploadState);
        expect(fakeUploadClient.cancelled).to.be.true;

    });

});