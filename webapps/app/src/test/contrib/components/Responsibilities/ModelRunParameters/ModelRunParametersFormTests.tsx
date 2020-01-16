import * as React from "react";
import { shallow, mount} from "enzyme";


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
        const store = createMockStore({runParameters: {uploadStatus: testUploadStatusOff}});
        const rendered = shallow(<ModelRunParametersForm disease={testDisease.id}/>, {context: {store}});
        expect(rendered.props().disease).toEqual(testDisease.id);
        expect(rendered.props().errors).toEqual([]);
        expect(rendered.props().status).toEqual("off");
    });

    it("renders on component level, form with props", () => {
        const store = createMockStore({runParameters: {uploadStatus: testUploadStatusOff}});
        const rendered = shallow(<ModelRunParametersForm/>, {context: {store}}).dive();
        const form = rendered.find('form');
        expect(form.length).toEqual(1);
        expect(typeof form.props().onSubmit).toEqual("function");
        expect(typeof form.props().onChange).toEqual("function");
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
        expect(errorBoxProps.isOpen).toEqual(false);
        expect(successBoxProps.isOpen).toEqual(false);
        expect(rendered.state().errors).toEqual([]);
        expect(rendered.state().success).toEqual(false);
        expect(rendered.state().disabled).toEqual(false);
        expect(rendered.find('button[type="submit"]').props().disabled).toEqual(false);
    });

    it("renders form, imitates it will start sending", () => {
        const rendered = shallow(<ModelRunParametersFormComponent {...componentDefaultProps} />);
        rendered.setState({disabled: true});
        expect(rendered.state().disabled).toEqual(true);
        expect(rendered.find('button[type="submit"]').props().disabled).toEqual(true);
    });

    it("renders form, imitates it received error, after sending", () => {
        const resetSpy = sandbox.createSpy();
        const componentProps = {...componentDefaultProps, resetUploadStatus: resetSpy};
        const rendered = shallow(<ModelRunParametersFormComponent {...componentProps} />);
        rendered.setState({disabled: true});
        expect(resetSpy.called).toEqual(false);
        // initiate props change
        rendered.setProps({
            status: RunParametersUploadStatus.completed,
            errors: [testError]
        });
        expect(resetSpy.called).toEqual(true);
        expect(rendered.state().disabled).toEqual(false);
        expect(rendered.state().success).toEqual(false);
        expect(rendered.state().errors).toEqual([testError]);
        expect(rendered.find('button[type="submit"]').props().disabled).toEqual(false);
        const errorBoxProps = rendered.find('Alert[color="danger"]').props() as any;
        expect(errorBoxProps.isOpen).toEqual(true);
        expect(rendered.find('Alert[color="danger"]').children().text()).toEqual(testErrorText);
    });

    it("renders form, imitates it received success, after sending", () => {
        const resetSpy = sandbox.createSpy();
        const componentProps = {...componentDefaultProps, resetUploadStatus: resetSpy};
        const rendered = shallow(<ModelRunParametersFormComponent {...componentProps} />);
        rendered.setState({disabled: true});
        expect(resetSpy.called).toEqual(false);
        // initiate props change
        rendered.setProps({
            status: RunParametersUploadStatus.completed,
            errors: null
        });
        expect(resetSpy.called).toEqual(true);
        expect(rendered.state().disabled).toEqual(false);
        expect(rendered.state().success).toEqual(true);
        expect(rendered.state().errors).toEqual([]);
        expect(rendered.find('button[type="submit"]').props().disabled).toEqual(false);
        const successBoxProps = rendered.find('Alert[color="success"]').props() as any;
        expect(successBoxProps.isOpen).toEqual(true);
        expect(rendered.find('Alert[color="success"]').children().text())
            .toEqual("Success! You have uploaded a new parameter set");
    });

    it("renders form simulates change form, will reset errors", () => {
        const rendered = shallow(<ModelRunParametersFormComponent {...componentDefaultProps} />);
        // initiate props change to set errors
        rendered.setProps({
            status: RunParametersUploadStatus.completed,
            errors: [testError]
        });
        expect(rendered.state().errors).toEqual([testError]);
        // should reset errors
        rendered.find('form').simulate('change');
        expect(rendered.state().errors).toEqual([]);
        const errorBoxProps = rendered.find('Alert[color="danger"]').props() as any;
        expect(errorBoxProps.isOpen).toEqual(false);
    });

    it("renders form simulates submit, upload button blocked", () => {
        const uploadSpy = sandbox.createSpy();
        const componentProps = {...componentDefaultProps, uploadSet: uploadSpy};
        const rendered = mount(<ModelRunParametersFormComponent {...componentProps} />);
        rendered.setState({disabled: true});
        const form = rendered.find('form');
        form.simulate('submit', {
            preventDefault: () => {},
            target: form
        });
        expect(uploadSpy.called).toEqual(true);
        rendered.setState({disabled: true});
        expect(rendered.state().disabled).toEqual(true);
        expect(rendered.find('button[type="submit"]').props().disabled).toEqual(true);
    });
});
