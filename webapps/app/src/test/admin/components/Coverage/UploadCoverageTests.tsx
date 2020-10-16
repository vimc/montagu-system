import {Sandbox} from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {shallow} from "enzyme";
import * as React from "react";
import {UploadCoverage} from "../../../../main/admin/components/Touchstones/Coverage/UploadCoverage";
import {CoverageUploadStatus} from "../../../../main/admin/actionTypes/CoverageTypes";
import {ModelRunParametersForm} from "../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";

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
        expect((rendered.find("#error-alert").props() as any).isOpen).toBe(false);
        expect((rendered.find("#success-alert").props() as any).isOpen).toBe(false);
        expect(rendered.find('button').text()).toBe("Upload");
        expect(rendered.find('button').props().disabled).toBe(true);
    });
});
