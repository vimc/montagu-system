import {ExpectationMapping} from "../../../../../main/shared/models/Generated";
import {mockExpectations} from "../../../../mocks/mockModels";
import {ExpectationsDescription} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsDescription";
import {shallow} from "enzyme";
import * as React from "react";
import {expect} from "chai";

describe("ExpectationsDescription", () => {
    it("renders applicable scenarios", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations(),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find(".h3").text()).to.equal("Template for a, b, c");
    });
});