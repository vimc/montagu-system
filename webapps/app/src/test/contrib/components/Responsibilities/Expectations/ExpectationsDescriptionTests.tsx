import {ExpectationMapping} from "../../../../../main/shared/models/Generated";
import {mockCountry, mockExpectationMapping, mockExpectations, mockScenario} from "../../../../mocks/mockModels";
import {ExpectationsDescription} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsDescription";
import {shallow} from "enzyme";
import * as React from "react";

import {FileDownloadButton} from "../../../../../main/shared/components/FileDownloadLink";
import {CountriesList} from "../../../../../main/contrib/components/Responsibilities/Expectations/CountriesList";
import {ModellingGroupsService} from "../../../../../main/shared/services/ModellingGroupsService";
import {Sandbox} from "../../../../Sandbox";
import {settings} from "../../../../../main/shared/Settings";

describe("ExpectationsDescription", () => {

    const mockScenarios = [
        mockScenario({id: "a", description: "Routine"}),
        mockScenario({id: "b", description: "Best case"}),
        mockScenario({id: "c", description: "Campaign"})];

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders description as title", () => {

        const expectation: ExpectationMapping = {
            disease: "YF",
            expectation: mockExpectations(),
            applicable_scenarios: ["a", "b", "c"]
        };

        const rendered = shallow(<ExpectationsDescription
            allScenarios={mockScenarios}
            expectationMapping={expectation}
            touchstoneVersionId="tId"
            groupId="gId"
        />);

        expect(rendered.find(".h3").text()).toEqual("description");

    });


    it("renders applicable scenarios sorted by description", () => {

        const expectation: ExpectationMapping = {
            disease: "YF",
            expectation: mockExpectations(),
            applicable_scenarios: ["a", "b", "c"]
        };

        const rendered = shallow(<ExpectationsDescription
            allScenarios={mockScenarios}
            expectationMapping={expectation}
            touchstoneVersionId="tId"
            groupId="gId"
        />);

        expect(rendered.find("#scenarios").find("li")).toHaveLength(3);
        expect(rendered.find("#scenarios").find("li").at(0).text()).toEqual("Best case (b)");
        expect(rendered.find("#scenarios").find("li").at(1).text()).toEqual("Campaign (c)");
        expect(rendered.find("#scenarios").find("li").at(2).text()).toEqual("Routine (a)");
    });

    it("renders number of years", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({years: {maximum_inclusive: 2000, minimum_inclusive: 1999}}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          allScenarios={mockScenarios}
                                                          touchstoneVersionId="tId"
                                                          groupId="gId"/>);
        expect(rendered.find("#years").text()).toEqual("2 years: 1999 - 2000");
    });

    it("renders number of ages", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({ages: {maximum_inclusive: 9, minimum_inclusive: 0}}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          allScenarios={mockScenarios}
                                                          touchstoneVersionId="tId"
                                                          groupId="gId"/>);
        expect(rendered.find("#ages").text()).toEqual("10 ages: 0 - 9");
    });

    it("renders cohort range if both min and max present", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({cohorts: {minimum_birth_year: 1980, maximum_birth_year: 1982}}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          touchstoneVersionId="tId"
                                                          allScenarios={mockScenarios}
                                                          groupId="gId"/>);
        expect(rendered.find("#cohorts").text()).toEqual("Not including cohorts born before 1980 or after 1982");
    });

    it("renders no cohort message if both null", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({cohorts: {minimum_birth_year: null, maximum_birth_year: null}}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          touchstoneVersionId="tId"
                                                          allScenarios={mockScenarios}
                                                          groupId="gId"/>);
        expect(rendered.find("#cohorts")).toHaveLength(0);
    });

    it("renders min cohort message if not null", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({cohorts: {minimum_birth_year: 1980, maximum_birth_year: null}}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          touchstoneVersionId="tId"
                                                          allScenarios={mockScenarios}
                                                          groupId="gId"/>);
        expect(rendered.find("#cohorts").text()).toEqual("Not including cohorts born before 1980");
    });

    it("renders max cohort message if not null", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({cohorts: {minimum_birth_year: null, maximum_birth_year: 1982}}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          touchstoneVersionId="tId"
                                                          allScenarios={mockScenarios}
                                                          groupId="gId"/>);
        expect(rendered.find("#cohorts").text()).toEqual("Not including cohorts born after 1982");
    });

    it("renders outcomes", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({outcomes: [{code: "deaths", name:"deaths"},
                                                                {code: "cases", name: "cases"}]}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          touchstoneVersionId="tId"
                                                          allScenarios={mockScenarios}
                                                          groupId="gId"/>);
        // The extra li is for cohort_size, which is hardcoded
        expect(rendered.find("#outcomes").find("li")).toHaveLength(2 + 1);
    });

    it("renders countries list", () => {
        const countries = [mockCountry({name: "countrya"}), mockCountry({name: "countryb"})];
        const expectation: ExpectationMapping = {
            expectation: mockExpectations({countries: countries}),
            applicable_scenarios: ["a", "b", "c"],
            disease: "YF"
        };
        const rendered = shallow(<ExpectationsDescription expectationMapping={expectation}
                                                          touchstoneVersionId="tId"
                                                          allScenarios={mockScenarios}
                                                          groupId="gId"/>);
        expect(rendered.find(CountriesList).prop("countries").sort()).toEqual(countries.sort())
    });


    it("renders FileDownloadButton for central template", () => {
        const em = mockExpectationMapping({},[]);
        const rendered = shallow(<ExpectationsDescription
            expectationMapping={em}
            touchstoneVersionId="tId"
            allScenarios={mockScenarios}
            groupId="gId"
        />);
        expect(rendered.find(FileDownloadButton).at(0).prop("href"))
            .toEqual(`/modelling-groups/gId/expectations/tId/${em.expectation.id}/`);
    });

    it(
        "renders FileDownloadButton for stochastic template for 2017 touchstone",
        () => {
            const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => true )

            const em = mockExpectationMapping({},[]);
            const rendered = shallow(<ExpectationsDescription
                expectationMapping={em}
                touchstoneVersionId="tId"
                allScenarios={mockScenarios}
                groupId="gId"
            />);
            expect(stub.called).toBe(true);
            expect(rendered.find(FileDownloadButton).at(1).prop("href"))
                .toEqual(`/modelling-groups/gId/expectations/tId/${em.expectation.id}/?type=stochastic`);
        }
    );

    it(
        "does not render FileDownloadButton for stochastic template for non-2017 touchstone",
        () => {
            const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => false )

            const em = mockExpectationMapping({},[]);
            const rendered = shallow(<ExpectationsDescription
                expectationMapping={em}
                touchstoneVersionId="tId"
                allScenarios={mockScenarios}
                groupId="gId"
            />);
            expect(stub.called).toBe(true);
            expect(rendered.find(FileDownloadButton).length).toEqual(1);
            expect(rendered.find(FileDownloadButton).at(0).prop("href"))
                .toEqual(`/modelling-groups/gId/expectations/tId/${em.expectation.id}/`); //single button is for central

        }
    );
});
