import {shallow} from "enzyme";
import * as React from "react";
import {expect} from "chai";

import {ExpectationMapping} from "../../../../../main/shared/models/Generated";
import {mockCountry, mockExpectations} from "../../../../mocks/mockModels";
import {ExpectationsDescription} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsDescription";

describe("ExpectationsDescription", () => {
    it("renders applicable scenarios", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations(),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find(".h3").text()).to.equal("Template for a, b, c");
    });

    it("renders number of years", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({years: {maximum_inclusive: 2000, minimum_inclusive: 1999}}),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find("#years").text()).to.equal("2 years: 1999 - 2000");
    });

    it("renders number of ages", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({ages: {maximum_inclusive: 9, minimum_inclusive: 0}}),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find("#ages").text()).to.equal("10 ages: 0 - 9");
    });

    it("renders number of cohorts if present", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({cohorts: {minimum_birth_year: 1980, maximum_birth_year: 1982}}),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find("#cohorts").text()).to.equal("3 cohorts: 1980 - 1982");
    });

    it("does not render number of cohorts if null", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({cohorts: {minimum_birth_year: null, maximum_birth_year: null}}),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find("#cohorts")).to.have.lengthOf(0);
    });

    it("renders outcomes", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({outcomes: ["deaths", "cases"]}),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find("#outcomes").text()).to.equal("2 outcomes: deaths, cases")
    });

    it("renders countries", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({countries: [mockCountry({name: "countrya"}), mockCountry({name: "countryb"})]}),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription {...expectation}/>);
        expect(rendered.find("#countries").text()).to.equal("2 countries: countrya, countryb")
    });

});