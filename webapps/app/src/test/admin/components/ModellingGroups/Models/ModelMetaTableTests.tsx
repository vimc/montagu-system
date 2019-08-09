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
import {expect} from "chai";
import * as React from "react";
import {
    ModelMetaTable,
    ModelMetaTableComponent,
} from "../../../../../main/admin/components/ModellingGroups/Models/ModelMetaTable";

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
        expectation: mockOutcomeExpectations({
            years: { minimum_inclusive: 1900, maximum_inclusive: 2000},
            ages: { minimum_inclusive: 0, maximum_inclusive: 99},
            cohorts: { minimum_birth_year: null, maximum_birth_year: 2000 },
            outcomes: ["deaths", "dalys"]
        })
    });
    const testExpectation2 = mockTouchstoneModelExpectations({
        disease: "d2",
        modelling_group: "gb",
        touchstone_version: "t-1",
        expectation: mockOutcomeExpectations({
            years: { minimum_inclusive: 1950, maximum_inclusive: 2000},
            ages: { minimum_inclusive: 0, maximum_inclusive: 49},
            cohorts: { minimum_birth_year: 1900, maximum_birth_year: 2000 },
            outcomes: ["deaths", "cases"]
        })
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
            has_dalys: true,
            max_countries: 2
        },
        {...testModel2,
            code: "C",
            is_dynamic: true,
            disease: "Disease 2",
            years: "1950 - 2000",
            ages: "0 - 49",
            cohorts: "1900 - 2000",
            outcomes: "deaths, cases",
            has_dalys: false,
            max_countries: 1
        }];

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("gets props from state", () => {
        const testState = {
            groups: {models: [testModel, testModel2], expectations: [testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}});

        expect(rendered.props().models).to.eql(mappedData);
    });

    it ("selects latest touchstone", () => {
        const earlierExpectation = mockTouchstoneModelExpectations({
            disease: "d1",
            modelling_group: "ga",
            touchstone_version: "s-1",
            expectation: mockOutcomeExpectations({
                years: { minimum_inclusive: 1910, maximum_inclusive: 2100},
                ages: { minimum_inclusive: 1, maximum_inclusive: 90},
                cohorts: { minimum_birth_year: 1800, maximum_birth_year: 1900 },
                outcomes: ["deaths2", "dalys2"]
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
                outcomes: ["deaths2", "cases2"]
            })
        });

        const testState = {
            groups: {models: [testModel, testModel2],
                     expectations: [earlierExpectation, earlierExpectation2,testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}});

        expect(rendered.props().models).to.eql(mappedData);
    });


    it("displays table of models", () => {
        const testState = {
            groups: {models: [testModel, testModel2], expectations: [testExpectation, testExpectation2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}}).dive();

        expect(rendered.find("th")).to.have.lengthOf(12);
        expect(rendered.find("th").at(0).text()).to.eq("Group");
        expect(rendered.find("th").at(1).text()).to.eq("Model Name");
        expect(rendered.find("th").at(2).text()).to.eq("Disease");
        expect(rendered.find("th").at(3).text()).to.eq("Model Type");
        expect(rendered.find("th").at(4).text()).to.eq("Code");
        expect(rendered.find("th").at(5).text()).to.eq("Gender");
        expect(rendered.find("th").at(6).text()).to.eq("Max Countries");
        expect(rendered.find("th").at(7).text()).to.eq("Years");
        expect(rendered.find("th").at(8).text()).to.eq("Ages");
        expect(rendered.find("th").at(9).text()).to.eq("Cohorts");
        expect(rendered.find("th").at(10).text()).to.eq("Outcomes");
        expect(rendered.find("th").at(11).text()).to.eq("DALYs");

        const body = rendered.find("tbody");

        expect(body.find("tr")).to.have.lengthOf(2);

        function cellsForRow(i: number) {
            return body.find("tr").at(i).find("td");
        }

        expect(cellsForRow(0).at(0).text()).to.eq("ga");
        expect(cellsForRow(0).at(1).text()).to.eq("mb");
        expect(cellsForRow(0).at(2).text()).to.eq("Disease 1");
        expect(cellsForRow(0).at(3).text()).to.eq("Static");
        expect(cellsForRow(0).at(4).text()).to.eq("R");
        expect(cellsForRow(0).at(5).text()).to.eq("NA");
        expect(cellsForRow(0).at(6).text()).to.eq("2");
        expect(cellsForRow(0).at(7).text()).to.eq("1900 - 2000");
        expect(cellsForRow(0).at(8).text()).to.eq("0 - 99");
        expect(cellsForRow(0).at(9).text()).to.eq("Max 2000");
        expect(cellsForRow(0).at(10).text()).to.eq("deaths, dalys");
        expect(cellsForRow(0).at(11).text()).to.eq("Yes");

        expect(cellsForRow(1).at(0).text()).to.eq("gb");
        expect(cellsForRow(1).at(1).text()).to.eq("ma");
        expect(cellsForRow(1).at(2).text()).to.eq("Disease 2");
        expect(cellsForRow(1).at(3).text()).to.eq("Dynamic");
        expect(cellsForRow(1).at(4).text()).to.eq("C");
        expect(cellsForRow(1).at(5).text()).to.eq("female");
        expect(cellsForRow(1).at(6).text()).to.eq("1");
        expect(cellsForRow(1).at(7).text()).to.eq("1950 - 2000");
        expect(cellsForRow(1).at(8).text()).to.eq("0 - 49");
        expect(cellsForRow(1).at(9).text()).to.eq("1900 - 2000");
        expect(cellsForRow(1).at(10).text()).to.eq("deaths, cases");
        expect(cellsForRow(1).at(11).text()).to.eq("No");
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
        assertSortsBy(6, "1", "2")
    });

    it("sorts by years", () => {
        assertSortsBy(7, "1900 - 2000", "1950 - 2000")
    });

    it("sorts by ages", () => {
        assertSortsBy(8, "0 - 49", "0 - 99")
    });

    it("sorts by cohorts", () => {
        assertSortsBy(9, "1900 - 2000", "Max 2000")
    });

    it("sorts by outcomes", () => {
        assertSortsBy(10, "deaths, cases", "deaths, dalys")
    });

    it("sorts by has dalys", () => {
        assertSortsBy(11, "Yes", "No")
    });

    function assertSortsBy(colIndex: number, ascValue: string, descValue: string) {

        const rendered = shallow(<ModelMetaTableComponent models={mappedData}/>);

        function getFirstRowValue() {
            return rendered.find("tbody").find("tr").at(0).find("td").at(colIndex).text()
        }

        rendered.find("th").at(colIndex).simulate("click");

        // ascending
        expect(getFirstRowValue()).to.eq(ascValue);
        expect(rendered.find("th").at(colIndex).hasClass("asc")).to.eq(true);
        expect(rendered.find("th").at(colIndex).hasClass("desc")).to.eq(false);

        rendered.find("th").at(colIndex).simulate("click");

        // descending
        expect(getFirstRowValue()).to.eq(descValue);
        expect(rendered.find("th").at(colIndex).hasClass("asc")).to.eq(false);
        expect(rendered.find("th").at(colIndex).hasClass("desc")).to.eq(true);
    }

});