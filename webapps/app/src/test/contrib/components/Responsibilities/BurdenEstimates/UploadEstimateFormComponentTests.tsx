import * as React from "react";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {
    initialUploadState,
    SelectedFile,
    UploadEstimatesFormComponent,
    UploadEstimatesState
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {mount, shallow} from "enzyme";
import {EventEmitter} from "events";
import {Alert} from "reactstrap";

import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";

describe("Upload Burden Estimates Form Component tests", () => {

    const sandbox = new Sandbox();

    class FakeUploadClient extends EventEmitter {
        cancelled: boolean;
        uploadStarted: boolean;
        retryStarted: boolean;
        files: [{ progress: () => number, retry: () => void }] = [{
            progress: () => 0, retry: () => {
                this.retryStarted = true
            }
        }];

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

        retry() {
            this.retryStarted = true
        }
    }

    let fakeUploadClient = new FakeUploadClient();
    const nullFunction = () => {
    };

    beforeEach(() => {
        window.fetch = jest.fn();
        fakeUploadClient = new FakeUploadClient();
    });

    afterEach(() => {
        sandbox.restore();
    });

    const getComponent = (props: any = {}) => {
        return shallow(<UploadEstimatesFormComponent
            createUploadClient={() => fakeUploadClient as any}
            createBurdenEstimateSet={props.createEstimateSet || nullFunction}
            populateEstimateSet={props.populateEstimateSet || nullFunction}
            hasPopulateSuccess={props.hasPopulateSuccess || false}
            populateErrors={[]}
            resetPopulateState={props.resetPopulateState || nullFunction}
            url={props.url != undefined ? "/url" : props.url}
            uploadToken={"TOKEN"}
            populatingInProgress={props.populatingInProgress || false}
            touchstoneId={"1"}
            scenarioId={"1"}
            groupId={"1"}/>);
    };

    it("validates file", () => {

        const result = getComponent();

        fakeUploadClient.emit("fileAdded", {fileName: "wrongfile.png"});
        expect(result.state().fileValidationResult.isValid).toBe(false);

        fakeUploadClient.emit("fileAdded", {fileName: "goodfile.csv"});
        expect(result.state().fileValidationResult.isValid).toBe(true);
    });

    describe("selected file component", () => {

        it("shows file if valid", () => {
            const state: UploadEstimatesState = {
                ...initialUploadState,
                file: {fileName: "test.csv"} as any,
                fileValidationResult: {isValid: true} as any
            };

            const result = mount(<SelectedFile {...state} />);

            expect(result.childAt(0).childAt(0).text()).toEqual("File selected: test.csv");
            expect(result.find(Alert).props().isOpen).toBe(false);
        });

        it("shows error if invalid", () => {
            const state: UploadEstimatesState = {
                ...initialUploadState,
                file: {fileName: "test.csv"} as any,
                fileValidationResult: {isValid: false, content: "some error"} as any
            };

            const result = mount(<SelectedFile {...state} />);

            expect(result.childAt(0).childAt(0).text()).toEqual("File selected: test.csv");
            expect(result.find(Alert).props().isOpen).toBe(true);
            expect(result.find(Alert).childAt(0).text()).toEqual("some error");
        });

        it("shows nothing if no file selected", () => {

            const result = mount(<SelectedFile {...initialUploadState} />);
            expect(result.children()).toHaveLength(0);
        });

    });

    it("file upload is disabled if url is null", () => {

        const result = shallow(<UploadEstimatesFormComponent
            createUploadClient={() => fakeUploadClient as any}
            createBurdenEstimateSet={nullFunction}
            populateEstimateSet={nullFunction}
            hasPopulateSuccess={false}
            populateErrors={[]}
            resetPopulateState={nullFunction}
            url={null}
            uploadToken={"TOKEN"}
            populatingInProgress={false}
            touchstoneId={"1"}
            scenarioId={"1"}
            groupId={"1"}/>);

        result.setState({file: {fileName: "test.csv"}});

        expect(result.find(".submit").props().disabled).toBe(true);
    });

    it("file upload is disabled if file is null", () => {

        const result = getComponent({metadata: {type: "central-averaged", details: "whatever"}});
        expect(result.find(".submit").props().disabled).toBe(true);
    });

    it("file upload is disabled if file is invalid", () => {

        const result = getComponent();
        result.setState({
            metadata: {type: "central-averaged", details: "whatever"},
            file: {fileName: "test.csv"},
            fileValidationResult: {isValid: false}
        });

        expect(result.find(".submit").props().disabled).toBe(true);
    });

    it("file upload is disabled if metadata is missing", () => {

        const result = getComponent();
        result.setState({file: {fileName: "test.csv"}, fileValidationResult: {isValid: true}});

        expect(result.find(".submit").props().disabled).toBe(true);
    });

    it("file upload is disabled while uploading is in progress", () => {

        const result = getComponent();
        result.setState({
            isUploading: true,
            metadata: {type: "central-averaged", details: "whatever"},
            file: {fileName: "test.csv"},
            validationResult: {isValid: true},
        });

        expect(result.find(".submit").props().disabled).toBe(true);
    });

    it("creates estimate set if metadata and file present", () => {

        const resetPopulateState = sandbox.createSpy();
        const createEstimateSet = sandbox.createSpy();
        const result = getComponent({resetPopulateState: resetPopulateState, createEstimateSet: createEstimateSet});
        result.setState({
            metadata: {
                type: "central-averaged",
                details: "whatever"
            },
            file: {fileName: "test.csv"}
        });
        result.find(".submit").simulate("click");
        expect(resetPopulateState.mock.calls.length).toBe(1);
        expect(createEstimateSet.mock.calls.length).toBe(1);
        expect(result.state().isUploading).toBe(true);
        expect(fakeUploadClient.uploadStarted).not.toBe(true);
    });

    it("uploads estimates when url changes", () => {

        const resetPopulateState = sandbox.createSpy();
        const createEstimateSet = sandbox.createSpy();
        const result = getComponent({
            resetPopulateState: resetPopulateState,
            createEstimateSet: createEstimateSet,
            url: null
        });
        result.setState({
            metadata: {
                type: "central-averaged",
                details: "whatever"
            },
            file: {fileName: "test.csv"}
        });
        result.find(".submit").simulate("click");
        expect(resetPopulateState.mock.calls.length).toBe(1);
        expect(createEstimateSet.mock.calls.length).toBe(1);

        result.setProps({url: "URL"});
        result.update();

        expect(fakeUploadClient.uploadStarted).toBe(true);
    });

    it("retries upload when url changes if file is unchanged", () => {

        // when file has already been uploaded, its progress will be stored in the upload client as 1
        fakeUploadClient.files[0].progress = () => 1;

        const resetPopulateState = sandbox.createSpy();
        const createEstimateSet = sandbox.createSpy();
        const result = getComponent({
            resetPopulateState: resetPopulateState,
            createEstimateSet: createEstimateSet,
            url: null
        });
        result.setState({
            metadata: {
                type: "central-averaged",
                details: "whatever"
            },
            file: {fileName: "test.csv"}
        });
        result.find(".submit").simulate("click");
        expect(resetPopulateState.mock.calls.length).toBe(1);
        expect(createEstimateSet.mock.calls.length).toBe(1);

        result.setProps({url: "URL"});
        result.update();

        expect(fakeUploadClient.retryStarted).toBe(true);
    });

    it("shows progress bar on file upload progress", () => {

        const result = getComponent();
        fakeUploadClient.emit("progress");
        expect(result.state().isUploading).toBe(true);
        expect(result.find(".progress").first().props().style["display"]).toBe("block");
        const progressBar = result.find(".progress-bar").first();
        expect(progressBar.props().style["width"]).toBe("27%");
        expect(progressBar.props().className).toEqual("progress-bar bg-success");

        const uploadButton = result.find(".submit.start").first();
        expect(uploadButton.props().disabled).toBe(true);

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

        expect(newState.isUploading).toBe(false);
        expect(newState.progress).toEqual(0);
        expect(newState.uploadErrors).toHaveLength(0);

        // it should retain the current file though
        expect(newState.file.fileName).toEqual("test.csv")
    });

    it("populates estimates on file upload success", () => {

        const populateEstimateSet = sandbox.createSpy();
        getComponent({populateEstimateSet});

        fakeUploadClient.emit("fileSuccess");
        expect(populateEstimateSet.mock.calls.length).toBe(1);
    });

    it("shows Montagu errors on file upload error", () => {

        const result = getComponent();
        fakeUploadClient.emit("fileError", {}, JSON.stringify({
            data: null,
            success: "failure",
            errors: [{code: "e", message: "test error"}]
        }));

        const allOpenAlerts = result.find(Alert).filterWhere((alert) => alert.props().isOpen);
        expect(allOpenAlerts).toHaveLength(1);

        const errorAlert = result.find(Alert).filterWhere((alert) => alert.props().id == "upload-errors")
            .childAt(0);

        expect(errorAlert.text()).toEqual("test error");
    });

    it("shows arbitrary errors on file upload error", () => {

        const result = getComponent();
        fakeUploadClient.emit("fileError", "someerror");

        const allOpenAlerts = result.find(Alert).filterWhere((alert) => alert.props().isOpen);
        expect(allOpenAlerts).toHaveLength(1);

        const errorAlert = result.find(Alert).filterWhere((alert) => alert.props().id == "upload-errors")
            .childAt(0);
        expect(errorAlert.text()).toEqual("Error contacting server");
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
        expect(result.state()).toEqual(initialUploadState);
        expect(fakeUploadClient.cancelled).toBe(true);

    });

    it(
        "hides buttons and displays loading element while populating is in progress",
        () => {

            const result = getComponent({populatingInProgress: true});
            expect(result.find("button")).toHaveLength(0);
            expect(result.find(LoadingElement)).toHaveLength(1);

        }
    );

});