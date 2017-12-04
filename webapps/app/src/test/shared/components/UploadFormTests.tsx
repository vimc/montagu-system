import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../Sandbox";
import {UploadFileForm} from "../../../main/shared/components/UploadFileForm";
import {helpers} from "../../../main/shared/Helpers";

describe('UploadForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("disables the submit button if enable submit is false", () => {

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success"}
                                           enableSubmit={false}
                                           token="token"/>);

        rendered.setState({"fileSelected": true});

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
        expect(uploadButton.hasClass("disabled")).to.eq(true);
    });

    it("disables submit button if token is null", () => {

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success"}
                                           enableSubmit={true}
                                           token={null}/>);

        rendered.setState({"fileSelected": true});

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
        expect(uploadButton.hasClass("disabled")).to.eq(true);
    });

    it("disables submit button if file not selected", () => {

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success"}
                                           enableSubmit={true}
                                           token="token"/>);

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
        expect(uploadButton.hasClass("disabled")).to.eq(true);
    });

    it("enables submit button if enableSubmit is true and token exists", () => {

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success"}
                                           enableSubmit={true}
                                           token="token"/>);

        rendered.setState({"fileSelected": true});

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(false);
        expect(uploadButton.hasClass("disabled")).to.eq(false);
    });

    it("does not show alert", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns(null);

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success message"}
                                           enableSubmit={true}
                                           token="token"/>);

        const alert = rendered.find('.alert');
        expect(alert).to.have.lengthOf(0);
    });

    it("ingests query string and displays error", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "failure",
            errors: [{code: "code", message: "error message"}],
            data: null
        });

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success"}
                                           enableSubmit={true}
                                           token="token"/>);

        const alert = rendered.find('.alert').first();
        expect(alert.prop("className")).to.eq("alert alert-danger");
        expect(alert.find('[data-role="alert-message"]').text()).to.eql("error message");
    });

    it("ingests query string and displays success message", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "success",
            errors: [],
            data: "OK"
        });

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success message"}
                                           enableSubmit={true}
                                           token="token"/>);

        const alert = rendered.find('.alert').first();
        expect(alert.prop("className")).to.eq("alert alert-success");
        expect(alert.find('[data-role="alert-message"]').text()).to.eql("success message");
    });

    it("closes alert", () => {

        sandbox.sinon.stub(helpers, "ingestQueryStringAndReturnResult").returns({
            status: "success",
            errors: [],
            data: "OK"
        });

        rendered = shallow(<UploadFileForm uploadText="upload text"
                                           successMessage={"success message"}
                                           enableSubmit={true}
                                           token="token"/>);

        const alertClose = rendered.find('.close').first();
        alertClose.simulate("click");

        const alert = rendered.find('.alert');
        expect(alert).to.have.lengthOf(0);
    });

});