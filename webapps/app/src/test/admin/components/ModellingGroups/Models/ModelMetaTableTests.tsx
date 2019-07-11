import {mockModel, mockModelVersion} from "../../../../mocks/mockModels";
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
        current_version: mockModelVersion({code: "R", is_dynamic: false})
    });
    const testModel2 = mockModel({
        id: 'ma', modelling_group: "gb",
        gender_specific: true, gender: "female",
        current_version: mockModelVersion({code: "C", is_dynamic: true})
    });

    const mappedData = [{...testModel, code: "R", is_dynamic: false}, {...testModel2, code: "C", is_dynamic: true}]

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("gets props from state", () => {
        const testState = {
            groups: {models: [testModel, testModel2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}});

        expect(rendered.props().models).to.eql(mappedData);
    });


    it("displays table of models", () => {
        const testState = {
            groups: {models: [testModel, testModel2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}}).dive();

        expect(rendered.find("th")).to.have.lengthOf(5);
        expect(rendered.find("th").at(0).text()).to.eq("Group");
        expect(rendered.find("th").at(1).text()).to.eq("Model Name");
        expect(rendered.find("th").at(2).text()).to.eq("Model Type");
        expect(rendered.find("th").at(3).text()).to.eq("Code");
        expect(rendered.find("th").at(4).text()).to.eq("Gender");

        const body = rendered.find("tbody");

        expect(body.find("tr")).to.have.lengthOf(2);

        function cellsForRow(i: number) {
            return body.find("tr").at(i).find("td");
        }

        expect(cellsForRow(0).at(0).text()).to.eq("ga");
        expect(cellsForRow(0).at(1).text()).to.eq("mb");
        expect(cellsForRow(0).at(2).text()).to.eq("Static");
        expect(cellsForRow(0).at(3).text()).to.eq("R");
        expect(cellsForRow(0).at(4).text()).to.eq("NA");

        expect(cellsForRow(1).at(0).text()).to.eq("gb");
        expect(cellsForRow(1).at(1).text()).to.eq("ma");
        expect(cellsForRow(1).at(2).text()).to.eq("Dynamic");
        expect(cellsForRow(1).at(3).text()).to.eq("C");
        expect(cellsForRow(1).at(4).text()).to.eq("female");
    });

    it("sorts by group", () => {
        assertSortsBy(0, "ga", "gb")
    });

    it("sorts by name", () => {
        assertSortsBy(1, "ma", "mb")
    });

    it("sorts by type", () => {
        assertSortsBy(2, "Dynamic", "Static")
    });

    it("sorts by code", () => {
        assertSortsBy(3, "C", "R")
    });

    it("sorts by gender", () => {
        assertSortsBy(4, "female", "NA")
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