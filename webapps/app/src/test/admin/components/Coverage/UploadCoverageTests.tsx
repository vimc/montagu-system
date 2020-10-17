import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {shallow} from "enzyme";
import * as React from "react";
import {UploadCoverage} from "../../../../main/admin/components/Touchstones/Coverage/UploadCoverage";
import {CoverageUploadStatus} from "../../../../main/admin/actionTypes/CoverageTypes";

describe("Upload Coverage component tests", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const initialUploadState = {status: CoverageUploadStatus.off, errors: [] as any};

    it("renders on connect level and receives proper props", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}});
        expect(rendered.props().errors).toEqual([]);
        expect(rendered.props().status).toEqual(CoverageUploadStatus.off);
    });

    it("renders on component level, form with props", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        const form = rendered.find('form');
        expect(form.length).toEqual(1);
        expect(typeof form.props().onSubmit).toEqual("function");
        expect(typeof form.props().onChange).toEqual("function");
    });

    it("renders as expected before select file", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        expect(rendered.find("CustomFileInput").props().accept).toBe(".csv");
        expect((rendered.find("#error-alert").props() as any).isOpen).toBe(false);
        expect((rendered.find("#success-alert").props() as any).isOpen).toBe(false);
        expect(rendered.find('button').text()).toBe("Upload");
        expect(rendered.find('button').props().disabled).toBe(true);
    });

    it("renders error alert", () => {
        const error = Error("TEST ERROR");
        const uploadState = {status: CoverageUploadStatus.completed, errors: [error]};
        const store = createMockStore({coverage: {uploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        expect((rendered.find("#error-alert").props() as any).isOpen).toBe(true);
        expect(rendered.find("#error-alert").html()).toContain("TEST ERROR");
        expect((rendered.find("#success-alert").props() as any).isOpen).toBe(false);
    });

    it("renders success alert", () => {
        const uploadState = {status: CoverageUploadStatus.in_progress, errors: [] as any};
        const store = createMockStore({coverage: {uploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        rendered.setProps({...uploadState, status: CoverageUploadStatus.completed});
        expect((rendered.find("#error-alert").props() as any).isOpen).toBe(false);
        expect((rendered.find("#success-alert").props() as any).isOpen).toBe(true);
        expect(rendered.find("#success-alert").html()).toContain("Success! You have uploaded a new coverage set");
    });

    it("enables upload button when a file is selected", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        const form = rendered.find('form');
        form.simulate('change');
        expect(rendered.find('button').props().disabled).toBe(false);
    });

    it("disabled upload button while file is uploading", () => {
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        const form = rendered.find('form');
        form.simulate('change');
        rendered.setProps({status: CoverageUploadStatus.in_progress});
        expect(rendered.find('button').props().disabled).toBe(true);
    });

    it("submitting form invokes uploadCoverage", () => {
        const uploadSpy = sandbox.createSpy();
        const store = createMockStore({coverage: {uploadState: initialUploadState}});
        const rendered = shallow(<UploadCoverage/>, {context: {store}}).dive();
        rendered.setProps({uploadCoverage: uploadSpy})

        const form = rendered.find('form');
        form.simulate('submit', {
            preventDefault: () => {},
            target: form
        });
        expect(uploadSpy.mock.calls.length).toBe(1);
    });
});
