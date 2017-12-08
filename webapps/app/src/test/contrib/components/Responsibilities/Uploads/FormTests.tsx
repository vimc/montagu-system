import * as React from "react";
import {expect} from "chai";
import {mount, render, shallow} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {CreateBurdenEstimateSetForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {Alert} from "../../../../../main/shared/components/Alert";
import {ReactElement} from "react";
import {OptionSelector} from "../../../../../../../app/src/main/contrib/components/OptionSelector/OptionSelector";
import {Form} from "../../../../../../../app/src/main/contrib/components/Responsibilities/BurdenEstimates/Form";
import {Result} from "../../../../../../../app/src/main/shared/models/Generated";

describe("CreateEstimatesFormComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders children", () => {

    });

    it("shows errors", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };

        const rendered = shallow(<Form {...props} />);
        const errors = [{code: "err", message: "err message"}];

        rendered.setState({errors: errors});
        rendered.update();

        expect(rendered.find(Alert).at(0).prop("hasError")).to.eq(true);
        expect(rendered.find(Alert).at(0).prop("hasSuccess")).to.eq(false);
    });

    it("shows success", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };

        const rendered = shallow(<Form {...props} />);
        rendered.setState({hasSuccess: true});

        expect(rendered.find(Alert).first().prop("hasSuccess")).to.eq(true);
        expect(rendered.find(Alert).first().prop("hasError")).to.eq(false);
    });

    it("result callback sets successful state", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };

        const form = new Form(props);
        const spy = sandbox.setSpy(form, "setState");

        form.resultCallback({status: "success", errors: [], data: null});

        expect(spy.calledWith({
            hasSuccess: true,
            errors: [],
            disabled: false
        })).to.eq(true);
    });

    it("calls success callback if result is successful", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };

        const form = new Form(props);
        const spy = sandbox.setSpy(props, "successCallback");

        form.resultCallback({status: "success", errors: [], data: null});

        expect(spy.called).to.eq(true);
    });

    it("does not call success callback if result is unsuccessful", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };

        const form = new Form(props);
        const spy = sandbox.setSpy(props, "successCallback");

        form.resultCallback({status: "failure", errors: [{code: "e1", message: "error one"}], data: null});

        expect(spy.called).to.eq(false);
    });

    it("result callback sets error state", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };
git s
        const form = new Form(props);

        const spy = sandbox.setSpy(form, "setState");

        const errors = [{code: "e1", message: "error one"}];
        form.resultCallback({status: "failure", errors: errors, data: null});

        expect(spy.calledWith({
            hasSuccess: false,
            errors: errors,
            disabled: false
        })).to.eq(true);
    });

    it("does not submit if validate fails", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };

        const form = new Form(props);
        const spy = sandbox.setSpy(form, "submitForm");
        sandbox.setStub(form, "getData").returns("test");

        const formElement = {checkValidity: () => false};

        form.onSubmit(Object.assign({ target: formElement, preventDefault: () => {} }));
        expect(spy.called).to.eq(false);

    });


    it("submits if validate passes", () => {
        const props = {
            url: "url",
            successCallback: (result: Result) => {
            },
            buildPostData: (formData: FormData) => {
            },
            successMessage: "success",
            submitText: "submit"
        };

        const form = new Form(props);
        const spy = sandbox.setSpy(form, "submitForm");
        sandbox.setStub(form, "getData").returns("test");

        const formElement = {checkValidity: () => true};

        form.onSubmit(Object.assign({ target: formElement, preventDefault: () => {} }));
        expect(spy.calledWith("test")).to.eq(true);

    });




});
