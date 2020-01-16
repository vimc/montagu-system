import * as React from "react";

import {shallow} from "enzyme";
import {ReduxFormValidationErrors} from "../../../main/shared/components/ReduxForm/ReduxFormValidationError";

describe("ReduxFormValidationErrors", () => {

    it("should return null if no errors", () => {

        const rendered = shallow(<ReduxFormValidationErrors errors={[]}/>);
        expect(rendered.find("div")).toHaveLength(0);
    });

    it("should return all error messages", () => {

        const rendered = shallow(<ReduxFormValidationErrors errors={[{message: "first error", code: "e"},
            {code: "e", message: "second error"}]}/>);
        expect(rendered.find("div").childAt(0).text()).toEqual("first error, second error")
    })

});