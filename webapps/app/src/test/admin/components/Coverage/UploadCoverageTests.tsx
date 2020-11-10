import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {shallow} from "enzyme";
import * as React from "react";
import {UploadCoverage} from "../../../../main/admin/components/Touchstones/Coverage/UploadCoverage";
import {CoverageUploadStatus} from "../../../../main/admin/actionTypes/CoverageTypes";
import {coverageActionCreators} from "../../../../main/admin/actions/coverageActionCreators";
import {CustomFileInput} from "../../../../main/shared/components/CustomFileInput";

describe("Upload Coverage component tests", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const initialUploadState = {status: CoverageUploadStatus.off, errors: [] as any};

    it("renders with props", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const uploadCoverageStub = sandbox.setStubReduxAction(coverageActionCreators, "uploadCoverage");
        const rendered = shallow(<UploadCoverage/>, {context: {store}});
        expect(rendered.props().errors).toEqual([]);
        expect(rendered.props().status).toEqual(CoverageUploadStatus.off);

        const uploadCoverageProp = rendered.props().uploadCoverage;
        uploadCoverageProp({} as FormData);
        expect(uploadCoverageStub.mock.calls.length).toBe(1);
    });

    it("initialises form props", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        const form = rendered.find('form');
        expect(form.length).toEqual(1);
        expect(typeof form.props().onSubmit).toEqual("function");
    });

    it("renders inputs", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        expect(rendered.find("CustomFileInput").length).toBe(1);
        expect(rendered.find("textarea").length).toBe(1);
        expect(rendered.find("textarea").props().name).toBe("description");
    });

    it("renders as expected before select file", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        expect(rendered.find("CustomFileInput").props().accept).toBe(".csv");
        expect(rendered.find("#error-alert").length).toBe(0);
        expect(rendered.find("#success-alert").length).toBe(0);
        expect(rendered.find('button').text()).toBe("Upload");
        expect(rendered.find('button').props().disabled).toBe(true);
    });

    it("renders error alert", () => {
        const uploadState = {status: CoverageUploadStatus.in_progress, errors: [] as any};
        const store = createMockStore({coverage: {uploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        const error = Error("TEST ERROR");
        rendered.setProps({status: CoverageUploadStatus.completed, errors: [error]});
        expect(rendered.find("#error-alert").length).toBe(1);
        expect(rendered.find("#error-alert").html()).toContain("TEST ERROR");
        expect(rendered.find("#success-alert").length).toBe(0);
    });

    it("renders success alert", () => {
        const uploadState = {status: CoverageUploadStatus.in_progress, errors: [] as any};
        const store = createMockStore({coverage: {uploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        rendered.setProps({...uploadState, status: CoverageUploadStatus.completed});
        expect(rendered.find("#error-alert").length).toBe(0);
        expect(rendered.find("#success-alert").length).toBe(1);
        expect(rendered.find("#success-alert").html()).toContain("Success! You have uploaded a new coverage set");
    });

    it("enables upload button when a file is selected", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        const fileInput = rendered.find(CustomFileInput);
        fileInput.dive().find("input").simulate("change", {target: {value: "testfile.csv"}});
        expect(rendered.find('button').props().disabled).toBe(false);
    });

    it("disabled upload button while file is uploading", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        const fileInput = rendered.find(CustomFileInput);
        fileInput.dive().find("input").simulate("change", {target: {value: "testfile.csv"}});
        expect(rendered.find('button').props().disabled).toBe(false);
        rendered.setProps({status: CoverageUploadStatus.in_progress});
        expect(rendered.find('button').props().disabled).toBe(true);
    });

    it("submitting form invokes uploadCoverage", () => {
        const uploadSpy = sandbox.createSpy();
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        rendered.setProps({uploadCoverage: uploadSpy});

        const form = rendered.find('form');
        form.simulate('submit', {
            preventDefault: () => {
            },
            target: form
        });
        expect(uploadSpy.mock.calls.length).toBe(1);
    });
});
