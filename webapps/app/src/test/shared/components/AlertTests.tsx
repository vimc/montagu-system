import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../Sandbox";
import {Alert} from "../../../main/shared/components/Alert";

describe('Alert', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("closes on click", () => {

        rendered = shallow(<Alert message={"message"} hasError={false} hasSuccess={true}/>);

        const alertClose = rendered.find('.close').first();
        alertClose.simulate("click");

        expect(rendered.find(".alert")).to.have.lengthOf(0);
    });


    it("has error state", () => {

        rendered = shallow(<Alert message={"message"} hasError={true} hasSuccess={false}/>);

        const alert = rendered.find(".alert");
        expect(alert.hasClass("alert-danger")).to.equal(true);
    });

    it("has success state", () => {

        rendered = shallow(<Alert message={"message"} hasError={false} hasSuccess={true}/>);

        const alert = rendered.find(".alert");
        expect(alert.hasClass("alert-success")).to.equal(true);
    });

    it("renders message", () => {

        rendered = shallow(<Alert message={"message"} hasError={false} hasSuccess={true}/>);

        const message = rendered.find('[data-role="alert-message"]');
        expect(message.text()).to.equal("message");
    });

    it("does not show if hasError and hasSuccess are false", () => {

        rendered = shallow(<Alert message={"message"} hasError={false} hasSuccess={false}/>);

        expect(rendered.find(".alert")).to.have.lengthOf(0);
    });

});