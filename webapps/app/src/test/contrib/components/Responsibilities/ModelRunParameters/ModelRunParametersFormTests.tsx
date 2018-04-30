import * as React from "react";
import { shallow, mount} from "enzyme";
import { expect } from "chai";

import "../../../../helper";
import {
    mockDisease,
} from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {
    ModelRunParametersForm,
    ModelRunParametersFormComponent, ModelRunParametersFormProps
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";
import {
    RunParametersUploadStatus,
    RunParametersUploadStatusData
} from "../../../../../main/contrib/actionTypes/RunParametersTypes";

describe("Model Run Parameters Content component tests with HOCs", () => {

    const testDisease = mockDisease();
    const testUploadStatusOff: RunParametersUploadStatusData = {
        errors: [],
        status: RunParametersUploadStatus.off
    };

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders on connect level and receives proper props", () => {
        const store = createMockStore({runParameters: {uploadStatus: testUploadStatusOff}})
        const rendered = shallow(<ModelRunParametersForm disease={testDisease.id}/>, {context: {store}});
        expect(rendered.props().disease).to.eql(testDisease.id);
        expect(rendered.props().errors).to.eql([]);
        expect(rendered.props().status).to.eql("off");
    });

    it("renders on component level, form with props", () => {
        const store = createMockStore({runParameters: {uploadStatus: testUploadStatusOff}})
        const rendered = shallow(<ModelRunParametersForm/>, {context: {store}}).dive();
        const form = rendered.find('form');
        expect(form.length).to.equal(1);
        expect(typeof form.props().onSubmit).to.equal("function");
        expect(typeof form.props().onChange).to.equal("function");
    });
});

describe("Model Run Parameters Content component tests, no HOCS", () => {

    const componentDefaultProps: ModelRunParametersFormProps = {
        disease: "d-1",
        errors: [],
        status: RunParametersUploadStatus.off,
        uploadSet: ()=>{},
        resetUploadStatus: ()=>{}
    };
    const testErrorText = 'Error text';
    const testError = new Error(testErrorText);

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders initial form state", () => {
        const rendered = shallow(<ModelRunParametersFormComponent {...componentDefaultProps} />);
        const errorBoxProps = rendered.find('Alert[color="danger"]').props() as any;
        const successBoxProps = rendered.find('Alert[color="success"]').props() as any;
        expect(errorBoxProps.isOpen).to.equal(false);
        expect(successBoxProps.isOpen).to.equal(false);
        expect(rendered.state().errors).to.eql([]);
        expect(rendered.state().success).to.equal(false);
        expect(rendered.state().disabled).to.equal(false);
        expect(rendered.find('button[type="submit"]').props().disabled).to.equal(false);
    });

    it("renders form, imitates it will start sending", () => {
        const rendered = shallow(<ModelRunParametersFormComponent {...componentDefaultProps} />);
        rendered.setState({disabled: true});
        expect(rendered.state().disabled).to.equal(true);
        expect(rendered.find('button[type="submit"]').props().disabled).to.equal(true);
    });

    it("renders form, imitates it received error, after sending", () => {
        const resetSpy = sandbox.createSpy();
        const componentProps = {...componentDefaultProps, resetUploadStatus: resetSpy}
        const rendered = shallow(<ModelRunParametersFormComponent {...componentProps} />);
        rendered.setState({disabled: true});
        expect(resetSpy.called).to.equal(false);
        // initiate props change
        rendered.setProps({
            status: RunParametersUploadStatus.completed,
            errors: [testError]
        });
        expect(resetSpy.called).to.equal(true);
        expect(rendered.state().disabled).to.equal(false);
        expect(rendered.state().success).to.equal(false);
        expect(rendered.state().errors).to.eql([testError]);
        expect(rendered.find('button[type="submit"]').props().disabled).to.equal(false);
        const errorBoxProps = rendered.find('Alert[color="danger"]').props() as any;
        expect(errorBoxProps.isOpen).to.equal(true);
        expect(rendered.find('Alert[color="danger"]').children().text()).to.equal(testErrorText);
    });

    it("renders form, imitates it received success, after sending", () => {
        const resetSpy = sandbox.createSpy();
        const componentProps = {...componentDefaultProps, resetUploadStatus: resetSpy}
        const rendered = shallow(<ModelRunParametersFormComponent {...componentProps} />);
        rendered.setState({disabled: true});
        expect(resetSpy.called).to.equal(false);
        // initiate props change
        rendered.setProps({
            status: RunParametersUploadStatus.completed,
            errors: null
        });
        expect(resetSpy.called).to.equal(true);
        expect(rendered.state().disabled).to.equal(false);
        expect(rendered.state().success).to.equal(true);
        expect(rendered.state().errors).to.eql([]);
        expect(rendered.find('button[type="submit"]').props().disabled).to.equal(false);
        const successBoxProps = rendered.find('Alert[color="success"]').props() as any;
        expect(successBoxProps.isOpen).to.equal(true);
        expect(rendered.find('Alert[color="success"]').children().text())
            .to.equal("Success! You have uploaded a new parameter set");
    });

    it("renders form simulates change form, will reset errors", () => {
        const rendered = shallow(<ModelRunParametersFormComponent {...componentDefaultProps} />);
        // initiate props change to set errors
        rendered.setProps({
            status: RunParametersUploadStatus.completed,
            errors: [testError]
        });
        expect(rendered.state().errors).to.eql([testError]);
        // should reset errors
        rendered.find('form').simulate('change');
        expect(rendered.state().errors).to.eql([]);
        const errorBoxProps = rendered.find('Alert[color="danger"]').props() as any;
        expect(errorBoxProps.isOpen).to.equal(false);
    });

    it("renders form simulates submit, upload button blocked", () => {
        const uploadSpy = sandbox.createSpy();
        const componentProps = {...componentDefaultProps, uploadSet: uploadSpy}
        const rendered = mount(<ModelRunParametersFormComponent {...componentProps} />);
        rendered.setState({disabled: true});
        const form = rendered.find('form');
        form.simulate('submit', {
            preventDefault: () => {},
            target: form
        });
        expect(uploadSpy.called).to.equal(true);
        rendered.setState({disabled: true});
        expect(rendered.state().disabled).to.equal(true);
        expect(rendered.find('button[type="submit"]').props().disabled).to.equal(true);
    });
});
