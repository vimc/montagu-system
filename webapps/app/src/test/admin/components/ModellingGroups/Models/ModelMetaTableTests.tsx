import {
    mockDisease,
    mockModel,
    mockModelVersion,
    mockOutcomeExpectations,
    mockTouchstoneModelExpectations
} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {shallow} from "enzyme";

import * as React from "react";
import {
    ModelMetaRow,
    ModelMetaTable,
    ModelMetaTableComponent,
} from "../../../../../main/admin/components/ModellingGroups/Models/ModelMetaTable";
import {UncontrolledTooltip} from "reactstrap";

describe("ModelMetaTable tests", () => {

    const testModel = mockModel({
        id: 'mb', modelling_group: "ga",
        gender_specific: null, gender: null,
        disease: mockDisease({id: "d1", name: "Disease 1"}),
        current_version: mockModelVersion({code: "R", is_dynamic: false,
            countries: [{id: "AA", name: "Country1"}, {id: "AB", name: "Country2"}]})
    });
    const testModel2 = mockModel({
        id: 'ma', modelling_group: "gb",
        gender_specific: true, gender: "female",
        disease: mockDisease({id: "d2", name: "Disease 2"}),
        current_version: mockModelVersion({code: "C", is_dynamic: true,
            countries: [{id: "AA", name: "Country1"}]})
    });

    const testExpectation = mockTouchstoneModelExpectations({
        disease: "d1",
        modelling_group: "ga",
        touchstone_version: "t-1",
        applicable_scenarios: ["scenario 1"],
        expectation: mockOutcomeExpectations({
            years: { minimum_inclusive: 1900, maximum_inclusive: 2000},
            ages: { minimum_inclusive: 0, maximum_inclusive: 99},
            cohorts: { minimum_birth_year: null, maximum_birth_year: 2000 },
            outcomes: [ {code: "deaths", name: "deaths name"}, {code: "dalys", name: "dalys name"}]
        })
    });
    const testExpectation2 = mockTouchstoneModelExpectations({
        disease: "d2",
        modelling_group: "gb",
        touchstone_version: "t-1",
        applicable_scenarios: ["scenario 1", "scenario 2"],
        expectation: mockOutcomeExpectations({
            years: { minimum_inclusive: 1950, maximum_inclusive: 2000},
            ages: { minimum_inclusive: 0, maximum_inclusive: 49},
            cohorts: { minimum_birth_year: 1900, maximum_birth_year: 2000 },
            outcomes: [{code: "deaths", name: "deaths name"}, {code: "cases", name: "cases name"}]
        })
    });

    const obsoleteTestModel = mockModel({
        id: 'omb', modelling_group: "oga",
        gender_specific: null, gender: null,
        disease: mockDisease({id: "d1", name: "Disease 1"}),
        current_version: mockModelVersion({code: "R", is_dynamic: false,
            countries: [{id: "AA", name: "Country1"}, {id: "AB", name: "Country2"}]})
    });
    const obsoleteTestModel2 = mockModel({
        id: 'omb2', modelling_group: "ogb",
        gender_specific: true, gender: "female",
        disease: mockDisease({id: "d3", name: "Disease 3"}),
        current_version: mockModelVersion({code: "C", is_dynamic: true,
            countries: [{id: "AA", name: "Country1"}]})
    });

    const mappedData = [
        {...testModel,
            code: "R",
            is_dynamic: false,
            disease: "Disease 1",
            years: "1900 - 2000",
            ages: "0 - 99",
            cohorts: "Max 2000",
            outcomes: "deaths, dalys",
            outcomes_details: [{code: "deaths", name: "deaths name"}, {code: "dalys", name: "dalys name"}],
            has_dalys: true,
            max_countries: 2,
            scenario_count: 1,
            countries: [{id: "AA", name: "Country1"}, {id: "AB", name: "Country2"}],
            scenarios: ["scenario 1"]
        },
        {...testModel2,
            code: "C",
            is_dynamic: true,
            disease: "Disease 2",
            years: "1950 - 2000",
            ages: "0 - 49",
            cohorts: "1900 - 2000",
            outcomes: "deaths, cases",
            outcomes_details: [{code: "deaths", name: "deaths name"}, {code: "cases", name: "cases name"}],
            has_dalys: false,
            max_countries: 1,
            scenario_count: 2,
            countries: [{id: "AA", name: "Country1"}],
            scenarios: ["scenario 1", "scenario 2"]
        }];

    const obsoleteMappedData: ModelMetaRow[] = [
        {...obsoleteTestModel,
            code: "R",
            is_dynamic: false,
            disease: "Disease 1",
            years: null,
            ages: null,
            cohorts: null,
            outcomes: null,
            outcomes_details: [],
            has_dalys: false,
            max_countries: 2,
            scenario_count: 0,
            countries: [{id: "AA", name: "Country1"}, {id: "AB", name: "Country2"}],
            scenarios: []
        },
        {...obsoleteTestModel2,
            code: "C",
            is_dynamic: true,
            disease: "Disease 3",
            years: null,
            ages: null,
            cohorts:null,
            outcomes: null,
            outcomes_details: [],
            has_dalys: false,
            max_countries: 1,
            scenario_count: 0,
            countries: [{id: "AA", name: "Country1"}],
            scenarios: []
        }];

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("gets props from state", () => {
        const testState = {
            groups: {models: [testModel, testModel2], expectations: [testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={false}/>, {context: {store}});

        expect(rendered.props().models).toEqual(mappedData);
    });

    it("selects latest touchstone", () => {
        const earlierExpectation = mockTouchstoneModelExpectations({
            disease: "d1",
            modelling_group: "ga",
            touchstone_version: "s-1",
            expectation: mockOutcomeExpectations({
                years: { minimum_inclusive: 1910, maximum_inclusive: 2100},
                ages: { minimum_inclusive: 1, maximum_inclusive: 90},
                cohorts: { minimum_birth_year: 1800, maximum_birth_year: 1900 },
                outcomes: [{code: "deaths2", name: "deaths2"}, {code: "dalys2", name: "dalys2"}]
            })
        });
        const earlierExpectation2 = mockTouchstoneModelExpectations({
            disease: "d2",
            modelling_group: "gb",
            touchstone_version: "s-1",
            expectation: mockOutcomeExpectations({
                years: { minimum_inclusive: 1951, maximum_inclusive: 20010},
                ages: { minimum_inclusive: 1, maximum_inclusive: 41},
                cohorts: { minimum_birth_year: 1901, maximum_birth_year: 2001 },
                outcomes: [{code: "deaths2", name: "deaths2"}, {code: "cases2", name: "cases2"}]
            })
        });

        const testState = {
            groups: {models: [testModel, testModel2],
                     expectations: [earlierExpectation, earlierExpectation2,testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={false}/>, {context: {store}});

        expect(rendered.props().models).toEqual(mappedData);
    });

    it("selects only current models if obsoleteOnly is false", () =>
    {
        const testState = {
            groups: {
                models: [testModel, obsoleteTestModel, testModel2, obsoleteTestModel2],
                expectations: [testExpectation, testExpectation2]
            }
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={false}/>, {context: {store}});

        expect(rendered.props().models).toEqual(mappedData);

    });


    it("displays table of models", () => {
        const testState = {
            groups: {models: [testModel, testModel2], expectations: [testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={false}/>, {context: {store}}).dive();

        expect(rendered.text()).not.toContain("The following obsolete models were also found.");

        expect(rendered.find("th")).toHaveLength(13);
        expect(rendered.find("th").at(0).text()).toEqual("Group");
        expect(rendered.find("th").at(1).text()).toEqual("Model Name");
        expect(rendered.find("th").at(2).text()).toEqual("Disease");
        expect(rendered.find("th").at(3).text()).toEqual("Model Type");
        expect(rendered.find("th").at(4).text()).toEqual("Code");
        expect(rendered.find("th").at(5).text()).toEqual("Gender");
        expect(rendered.find("th").at(6).text()).toEqual("Max Countries");
        expect(rendered.find("th").at(7).text()).toEqual("Scenarios");
        expect(rendered.find("th").at(8).text()).toEqual("Years");
        expect(rendered.find("th").at(9).text()).toEqual("Ages");
        expect(rendered.find("th").at(10).text()).toEqual("Cohorts");
        expect(rendered.find("th").at(11).text()).toEqual("Outcomes");
        expect(rendered.find("th").at(12).text()).toEqual("DALYs");

        const body = rendered.find("tbody");

        expect(body.find("tr")).toHaveLength(2);

        function cellsForRow(i: number) {
            return body.find("tr").at(i).find("td");
        }

        expect(cellsForRow(0).at(0).text()).toEqual("ga");
        expect(cellsForRow(0).at(1).text()).toEqual("mb");
        expect(cellsForRow(0).at(2).text()).toEqual("Disease 1");
        expect(cellsForRow(0).at(3).text()).toEqual("Static");
        expect(cellsForRow(0).at(4).text()).toEqual("R");
        expect(cellsForRow(0).at(5).text()).toEqual("NA");
        expect(cellsForRow(0).at(6).text()).toEqual("2" + "view");
        expect(cellsForRow(0).at(7).text()).toEqual("1 scenario" + "view");
        expect(cellsForRow(0).at(8).text()).toEqual("1900 - 2000");
        expect(cellsForRow(0).at(9).text()).toEqual("0 - 99");
        expect(cellsForRow(0).at(10).text()).toEqual("Max 2000");
        expect(cellsForRow(0).at(11).text()).toEqual("deaths, dalys" + "definitions");
        expect(cellsForRow(0).at(12).text()).toEqual("Yes");

        expect(cellsForRow(1).at(0).text()).toEqual("gb");
        expect(cellsForRow(1).at(1).text()).toEqual("ma");
        expect(cellsForRow(1).at(2).text()).toEqual("Disease 2");
        expect(cellsForRow(1).at(3).text()).toEqual("Dynamic");
        expect(cellsForRow(1).at(4).text()).toEqual("C");
        expect(cellsForRow(1).at(5).text()).toEqual("female");
        expect(cellsForRow(1).at(6).text()).toEqual("1" + "view");
        expect(cellsForRow(1).at(7).text()).toEqual("2 scenarios" + "view");
        expect(cellsForRow(1).at(8).text()).toEqual("1950 - 2000");
        expect(cellsForRow(1).at(9).text()).toEqual("0 - 49");
        expect(cellsForRow(1).at(10).text()).toEqual("1900 - 2000");
        expect(cellsForRow(1).at(11).text()).toEqual("deaths, cases" + "definitions");
        expect(cellsForRow(1).at(12).text()).toEqual("No");
    });

    it("does not render details links if no items to view", () => {
        const minimalModel = mockModel({
            id: 'mb', modelling_group: "ga",
            gender_specific: null, gender: null,
            disease: mockDisease({id: "d1", name: "Disease 1"}),
            current_version: mockModelVersion({code: "R", is_dynamic: false,
                countries: []})
        });

        const minimalExpectation = mockTouchstoneModelExpectations({
            disease: "d1",
            modelling_group: "ga",
            touchstone_version: "t-1",
            applicable_scenarios: [],
            expectation: mockOutcomeExpectations({
                years: { minimum_inclusive: 1900, maximum_inclusive: 2000},
                ages: { minimum_inclusive: 0, maximum_inclusive: 99},
                cohorts: { minimum_birth_year: null, maximum_birth_year: 2000 },
                outcomes: []
            })
        });

        const testState = {
            groups: {models: [minimalModel], expectations: [minimalExpectation]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={false}/>, {context: {store}}).dive();

        const body = rendered.find("tbody");

        function cellsForRow(i: number) {
            return body.find("tr").at(i).find("td");
        }

        expect(cellsForRow(0).at(6).text()).toEqual("0"); //max countries
        expect(cellsForRow(0).at(7).text()).toEqual("0 scenarios");
        expect(cellsForRow(0).at(11).text()).toEqual(""); //outcomes
    });

    it("sorts by group", () => {
        assertSortsBy(0, "ga", "gb")
    });

    it("sorts by name", () => {
        assertSortsBy(1, "ma", "mb")
    });

    it("sorts by disease", () => {
        assertSortsBy(2, "Disease 1", "Disease 2")
    });

    it("sorts by type", () => {
        assertSortsBy(3, "Dynamic", "Static")
    });

    it("sorts by code", () => {
        assertSortsBy(4, "C", "R")
    });

    it("sorts by gender", () => {
        assertSortsBy(5, "female", "NA")
    });

    it("sorts by max countries", () => {
        assertSortsBy(6, "1" + "view", "2" + "view")
    });

    it("sorts by scenario", () => {
        assertSortsBy(7, "1 scenario" + "view", "2 scenarios" +  "view")
    });

    it("sorts by years", () => {
        assertSortsBy(8, "1900 - 2000", "1950 - 2000")
    });

    it("sorts by ages", () => {
        assertSortsBy(9, "0 - 49", "0 - 99")
    });

    it("sorts by cohorts", () => {
        assertSortsBy(10, "1900 - 2000", "Max 2000")
    });

    it("sorts by outcomes", () => {
        assertSortsBy(11, "deaths, cases" + "definitions", "deaths, dalys" + "definitions")
    });

    it("sorts by has dalys", () => {
        assertSortsBy(12, "Yes", "No")
    });

    it("shows countries tooltips", () => {
        assertTooltip(6, 0, "countries-details-link-0", ["Country1 (AA)","Country2 (AB)"]);
        assertTooltip(6, 1, "countries-details-link-1", ["Country1 (AA)"]);
    });

    it("shows scenario tooltips", () => {
        assertTooltip(7, 0, "scenario-details-link-0", ["scenario 1"]);
        assertTooltip(7, 1, "scenario-details-link-1", ["scenario 1","scenario 2"]);
    });

    it("shows outcomes tooltips", () => {
        assertTooltip(11, 0, "outcomes-details-link-0", ["deaths: deaths name", "dalys: dalys name"]);
        assertTooltip(11, 1, "outcomes-details-link-1", ["deaths: deaths name","cases: cases name"]);
    });

    it("selects only obsolete models if obsoleteOnly is true", () =>
    {
        const testState = {
            groups: {
                models: [testModel, obsoleteTestModel, testModel2, obsoleteTestModel2],
                expectations: [testExpectation, testExpectation2]
            }
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={true}/>, {context: {store}});

        expect(rendered.props().models).toEqual(obsoleteMappedData);

    });

    it("displays table of obsolete models", () => {
        const testState = {
            groups: {models: [obsoleteTestModel, obsoleteTestModel2], expectations: [testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={true}/>, {context: {store}}).dive();

        expect(rendered.text().startsWith("The following obsolete models were also found.")).toBe(true);

        expect(rendered.find("th")).toHaveLength(7);
        expect(rendered.find("th").at(0).text()).toEqual("Group");
        expect(rendered.find("th").at(1).text()).toEqual("Model Name");
        expect(rendered.find("th").at(2).text()).toEqual("Disease");
        expect(rendered.find("th").at(3).text()).toEqual("Model Type");
        expect(rendered.find("th").at(4).text()).toEqual("Code");
        expect(rendered.find("th").at(5).text()).toEqual("Gender");
        expect(rendered.find("th").at(6).text()).toEqual("Max Countries");


        const body = rendered.find("tbody");

        expect(body.find("tr")).toHaveLength(2);

        function cellsForRow(i: number) {
            return body.find("tr").at(i).find("td");
        }

        expect(cellsForRow(0).at(0).text()).toEqual("oga");
        expect(cellsForRow(0).at(1).text()).toEqual("omb");
        expect(cellsForRow(0).at(2).text()).toEqual("Disease 1");
        expect(cellsForRow(0).at(3).text()).toEqual("Static");
        expect(cellsForRow(0).at(4).text()).toEqual("R");
        expect(cellsForRow(0).at(5).text()).toEqual("NA");
        expect(cellsForRow(0).at(6).text()).toEqual("2" + "view");

        expect(cellsForRow(1).at(0).text()).toEqual("ogb");
        expect(cellsForRow(1).at(1).text()).toEqual("omb2");
        expect(cellsForRow(1).at(2).text()).toEqual("Disease 3");
        expect(cellsForRow(1).at(3).text()).toEqual("Dynamic");
        expect(cellsForRow(1).at(4).text()).toEqual("C");
        expect(cellsForRow(1).at(5).text()).toEqual("female");
        expect(cellsForRow(1).at(6).text()).toEqual("1" + "view");

    });

    it(
        "does not render table or message if obsoleteOnly is true and there are none",
        () => {
            const testState = {
                groups: {models: [testModel], expectations: [testExpectation, testExpectation2]}
            };
            const store = createMockStore(testState);
            const rendered = shallow(<ModelMetaTable obsoleteOnly={true}/>, {context: {store}}).dive();

            expect(rendered.text()).toEqual("");

            expect(rendered.find("table")).toHaveLength(0);
        }
    );

    it("shows countries tooltips for obsolete models", () => {
        assertTooltip(6, 0, "countries-details-link-0", ["Country1 (AA)","Country2 (AB)"], true);
        assertTooltip(6, 1, "countries-details-link-1", ["Country1 (AA)"], true);
    });

    function assertSortsBy(colIndex: number, ascValue: string, descValue: string) {

        const rendered = shallow(<ModelMetaTableComponent models={mappedData} obsoleteOnly={false}/>);

        function getFirstRowValue() {
            return rendered.find("tbody").find("tr").at(0).find("td").at(colIndex).text()
        }

        rendered.find("th").at(colIndex).simulate("click");

        // ascending
        expect(getFirstRowValue()).toEqual(ascValue);
        expect(rendered.find("th").at(colIndex).hasClass("asc")).toEqual(true);
        expect(rendered.find("th").at(colIndex).hasClass("desc")).toEqual(false);

        rendered.find("th").at(colIndex).simulate("click");

        // descending
        expect(getFirstRowValue()).toEqual(descValue);
        expect(rendered.find("th").at(colIndex).hasClass("asc")).toEqual(false);
        expect(rendered.find("th").at(colIndex).hasClass("desc")).toEqual(true);
    }

    function assertTooltip(colIndex: number, rowIndex: number, target: string, contents: string[], obsoleteModels:boolean=false) {
        const testState = {
            groups: {models: [testModel, testModel2, obsoleteTestModel, obsoleteTestModel2], expectations: [testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable obsoleteOnly={obsoleteModels}/>, {context: {store}}).dive();

        const row =  rendered.find("tbody").find("tr").at(rowIndex);

        const cell = row.find("td").at(colIndex);
        const link = cell.find("a");
        expect(link.prop("id")).toEqual(target);

        const tooltip = row.find(UncontrolledTooltip).find(`[target="${target}"]`).dive();

        expect(tooltip.prop("target")).toEqual(target);
        expect(tooltip.prop("className")).toEqual("model-meta-tooltip");
        expect(tooltip.prop("autohide")).toEqual(false);

        for (let i: number = 0; i < contents.length; i++) {
            expect(tooltip.childAt(i).text()).toEqual(contents[i]);
        }
    }

});