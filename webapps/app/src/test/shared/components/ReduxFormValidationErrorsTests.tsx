import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {ReduxFormValidationErrors} from "../../../main/shared/components/ReduxForm/ReduxFormValidationError";
import {Alert} from "reactstrap";


describe("ReduxFormValidationErrors", () => {

    it("should return null if no errors", () => {

        const rendered = shallow(<ReduxFormValidationErrors errors={[]}/>);
        expect(rendered.find(Alert)).to.have.lengthOf(0);
    });

    it("should return all error messages", () => {

        const rendered = shallow(<ReduxFormValidationErrors errors={[{message: "first error", code: "e"},
            {code: "e", message: "second error"}]}/>);
        expect(rendered.find(Alert).text()).to.eq("first error, second error")
    })

});