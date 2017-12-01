import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../Sandbox";
import {UploadForm} from "../../../main/shared/components/UploadForm";

describe('UploadForm', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("disables the submit button if enable submit is false", () => {

        rendered = shallow(<UploadForm uploadText="upload text"
                                       enableSubmit={false}
                                       token="token"/>);

        rendered.setState({"fileSelected": true});

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
        expect(uploadButton.hasClass("disabled")).to.eq(true);
    });

    it("disables submit button if token is null", () => {

        rendered = shallow(<UploadForm uploadText="upload text"
                                       enableSubmit={true}
                                       token={null}/>);

        rendered.setState({"fileSelected": true});

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
        expect(uploadButton.hasClass("disabled")).to.eq(true);
    });

    it("disables submit button if file not selected", () => {

        rendered = shallow(<UploadForm uploadText="upload text"
                                       enableSubmit={true}
                                       token="token"/>);

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(true);
        expect(uploadButton.hasClass("disabled")).to.eq(true);
    });

    it("enables submit button if enableSubmit is true and token exists", () => {

        rendered = shallow(<UploadForm uploadText="upload text"
                                       enableSubmit={true}
                                       token="token"/>);

        rendered.setState({"fileSelected": true});

        const uploadButton = rendered.find(`button`).first();
        expect(uploadButton.prop("disabled")).to.eq(false);
        expect(uploadButton.hasClass("disabled")).to.eq(false);
    });

});