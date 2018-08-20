import {mockDisease, mockScenario} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import * as React from "react";
import {expect} from "chai";
import {
    ScenarioGroup,
    ScenarioGroupProps
} from "../../../../../main/admin/components/Touchstones/Scenarios/ScenarioGroup";

describe("ScenarioGroup", () => {
    it("renders one row per scenario", () => {
        const props: ScenarioGroupProps = {
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario(), mockScenario()]
        };
        const rendered = shallow(<ScenarioGroup {...props}/>);
        expect(rendered.find("h3").text()).to.equal("Chicken pox");
        const rows = rendered.find("li");
        expect(rows).to.have.length(2);
    });
});