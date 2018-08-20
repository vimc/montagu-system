import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockScenario} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {
    ScenariosList,
    ScenariosListComponent,
    ScenariosListProps
} from "../../../../../main/admin/components/Touchstones/Scenarios/ScenariosList";
import * as React from "react";
import {expect} from "chai";

describe("ScenariosList", () => {
    it("maps state to props", () => {
        const scenarios = [mockScenario(), mockScenario()];
        const store = createMockAdminStore({scenario: {scenarios}});
        const rendered = shallow(<ScenariosList/>, {context: {store}});
        const expectedProps: ScenariosListProps = { scenarios };
        expect(rendered.find(ScenariosListComponent).props()).to.eql(expectedProps);
    });
});