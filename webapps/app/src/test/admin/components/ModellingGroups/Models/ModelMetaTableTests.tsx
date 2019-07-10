import {mockModel} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {ModelMetaTable,} from "../../../../../main/admin/components/ModellingGroups/Models/ModelMetaTable";

describe("ModelMetaTable tests", () => {

    const testModel = mockModel({id: 'mb', modelling_group: "ga"});
    const testModel2 = mockModel({id: 'ma', modelling_group: "gb"});

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("gets props from state", () => {
        const testState = {
            groups: {models: [testModel, testModel2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}});
        expect(rendered.props().models).to.eql([testModel, testModel2]);
    });


    it("displays table of models", () => {
        const testState = {
            groups: {models: [testModel, testModel2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}}).dive();

        expect(rendered.find("th")).to.have.lengthOf(2);
        expect(rendered.find("th").at(0).text()).to.eq("Group");
        expect(rendered.find("th").at(1).text()).to.eq("Model Name");

        const body = rendered.find("tbody");

        expect(body.find("tr")).to.have.lengthOf(2);

        function cellsForRow(i: number) {
            return body.find("tr").at(i).find("td");
        }
        expect(cellsForRow(0).at(0).text()).to.eq("ga");
        expect(cellsForRow(0).at(1).text()).to.eq("mb");

        expect(cellsForRow(1).at(0).text()).to.eq("gb");
        expect(cellsForRow(1).at(1).text()).to.eq("ma");
    });

    it("sorts by group", () => {
        const testState = {
            groups: {models: [testModel, testModel2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}}).dive();

        function getFirstGroup() {
            return rendered.find("tbody").find("tr").at(0).find("td").at(0).text()
        }

        rendered.find("th").at(0).simulate("click");

        // ascending
        expect(getFirstGroup()).to.eq("ga");
        expect(rendered.find("th").at(0).hasClass("asc")).to.eq(true);
        expect(rendered.find("th").at(0).hasClass("desc")).to.eq(false);


        rendered.find("th").at(0).simulate("click");

        // descending
        expect(getFirstGroup()).to.eq("gb");
        expect(rendered.find("th").at(0).hasClass("asc")).to.eq(false);
        expect(rendered.find("th").at(0).hasClass("desc")).to.eq(true);
    });


    it("sorts by name", () => {
        const testState = {
            groups: {models: [testModel, testModel2]}
        };
        const store = createMockStore(testState);
        const rendered = shallow(<ModelMetaTable/>, {context: {store}}).dive();

        function getFirstModel() {
            return rendered.find("tbody").find("tr").at(0).find("td").at(1).text()
        }

        rendered.find("th").at(1).simulate("click");

        // ascending
        expect(getFirstModel()).to.eq("ma");
        expect(rendered.find("th").at(1).hasClass("asc")).to.eq(true);
        expect(rendered.find("th").at(1).hasClass("desc")).to.eq(false);

        rendered.find("th").at(1).simulate("click");

        // descending
        expect(getFirstModel()).to.eq("mb");
        expect(rendered.find("th").at(1).hasClass("asc")).to.eq(false);
        expect(rendered.find("th").at(1).hasClass("desc")).to.eq(true);
    });

});