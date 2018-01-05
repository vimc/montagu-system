import * as React from "react";
import {expect} from "chai";
import {mount} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {Alert} from "reactstrap";
import {Form} from "../../../../../main/shared/components/Form";
import {Result} from "../../../../../main/shared/models/Generated";
import {mockFetcherResponse } from "../../../../mocks/mockRemote";
import {checkAsync} from "../../../../testHelpers";

describe("FormComponent", () => {
    const sandbox = new Sandbox();

    const props = {
        url: "url",
        successCallback: (result: Result) => {
        },
        data: {something: "somevalue"},
        successMessage: "success message",
        submitText: "submit"
    };

    afterEach(() => {
        sandbox.restore();
    });

    it("renders children", () => {

        const rendered = mount(<Form {...props}><span id="test">hi</span></Form>);
        expect(rendered.find("#test").text()).to.eq("hi");
    });

    it("passes errors to alert", () => {

        const rendered = mount(<Form {...props} />);
        const errors = [{code: "err", message: "err message"}];

        rendered.setState({errors: errors});

        const alerts = rendered.find(Alert);
        expect(alerts).to.have.lengthOf(2);

        const errorAlert = alerts.first();
        const successAlert = alerts.last();

        expect(errorAlert.prop("isOpen")).to.eq(true);
        expect(successAlert.prop("isOpen")).to.eq(false);
        expect(errorAlert.text()).to.eq("err message");
    });

    it("passes success to alert", () => {

        const rendered = mount(<Form {...props} />);
        rendered.setState({hasSuccess: true});

        const alerts = rendered.find(Alert);
        expect(alerts).to.have.lengthOf(2);

        const errorAlert = alerts.first();
        const successAlert = alerts.last();

        expect(errorAlert.prop("isOpen")).to.eq(false);
        expect(successAlert.prop("isOpen")).to.eq(true);
        expect(successAlert.text()).to.eq("success message");
    });

    it("result callback sets successful state", () => {

        const form = new Form(props);
        const spy = sandbox.setStub(form, "setState");

        form.resultCallback({status: "success", errors: [], data: null});

        expect(spy.calledWith({
            hasSuccess: true,
            errors: [],
            disabled: false,
            validated: false
        })).to.eq(true);
    });

    it("calls result callback", (done) => {

        mockFetcherResponse();
        const form = new Form(props);
        sandbox.setStub(form, "setState");

        const spy = sandbox.setStub(form, "resultCallback");
        form.submitForm(null);

        checkAsync(done, (afterWait) => {
            afterWait(done, () => {
                expect(spy.called).to.eq(true);
            })
        })
    });

    it("calls success callback if result is successful", () => {

        const form = new Form(props);
        sandbox.setStub(form, "setState");
        const spy = sandbox.setSpy(props, "successCallback");

        form.resultCallback({status: "success", errors: [], data: null});

        expect(spy.called).to.eq(true);
    });

    it("does not call success callback if result is unsuccessful", () => {

        const form = new Form(props);
        sandbox.setStub(form, "setState");
        const spy = sandbox.setSpy(props, "successCallback");

        form.resultCallback({status: "failure", errors: [{code: "e1", message: "error one"}], data: null});

        expect(spy.called).to.eq(false);
    });

    it("result callback sets error state", () => {

        const form = new Form(props);

        const spy = sandbox.setStub(form, "setState");

        const errors = [{code: "e1", message: "error one"}];
        form.resultCallback({status: "failure", errors: errors, data: null});

        expect(spy.calledWith({
            hasSuccess: false,
            errors: errors,
            disabled: false,
            validated: false
        })).to.eq(true);
    });

    it("does not submit if validate fails", () => {

        const form = new Form(props);
        const spy = sandbox.setSpy(form, "submitForm");
        sandbox.setStub(form, "setState");
        sandbox.setStub(form, "getData").returns("test");

        const formElement = {checkValidity: () => false};

        form.onSubmit({
            target: formElement, preventDefault: () => {
            }
        } as any);
        expect(spy.called).to.eq(false);

    });

    it("submits if validate passes", () => {

        const form = new Form(props);
        const spy = sandbox.setSpy(form, "submitForm");
        sandbox.setStub(form, "setState");
        sandbox.setStub(form, "getData").returns("test");

        const formElement = {checkValidity: () => true};

        form.onSubmit({
            target: formElement, preventDefault: () => {
            }
        } as any);

        expect(spy.called).to.eq(true);

    });

    it("sets state to validated after submit", () => {

        const form = new Form(props);
        sandbox.setStub(form, "submitForm");
        sandbox.setStub(form, "getData").returns("test");
        const spy = sandbox.setStub(form, "setState");

        const formElement = {checkValidity: () => true};

        form.onSubmit({
            target: formElement, preventDefault: () => {
            }
        } as any);

        expect(spy.calledWith({validated: true})).to.eq(true);

    });

    it("adds was-validated class to form", () => {

        const rendered = mount(<Form {...props} />);

        expect(rendered.find("form").hasClass("was-validated")).to.eq(false);

        rendered.setState({validated: true});

        expect(rendered.find("form").hasClass("was-validated")).to.eq(true);
    });
});
