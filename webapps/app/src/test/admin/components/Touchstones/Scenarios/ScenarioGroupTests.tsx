import {mockDisease, mockScenario} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import * as React from "react";
import {expect} from "chai";
import {
    ScenarioGroup, ScenarioGroupComponent,
    ScenarioGroupProps
} from "../../../../../main/admin/components/Touchstones/Scenarios/ScenarioGroup";
import {FileDownloadButton} from "../../../../../main/shared/components/FileDownloadLink";
import {UncontrolledTooltip} from "reactstrap";

describe("ScenarioGroup", () => {
    it("renders one row per scenario", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: true,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario(), mockScenario()]
        };
        const rendered = shallow(<ScenarioGroupComponent {...props}/>);
        expect(rendered.find("h3").text()).to.equal("Chicken pox");
        const rows = rendered.find("li");
        expect(rows).to.have.length(2);
    });

    it("disables button and shows tooltip if canDownloadCoverage is false", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: false,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario()]
        };
        const rendered = shallow(<ScenarioGroupComponent {...props}/>);
        expect(rendered.find("h3").text()).to.equal("Chicken pox");
        const row = rendered.find("li").at(0);
        const buttons = row.find(FileDownloadButton);

        expect(buttons).to.have.lengthOf(2);

        buttons.forEach(button =>
            { expect(button.prop("href")).to.be.null; }
        );

        expect(row.find(UncontrolledTooltip)).to.have.lengthOf(1);

    });

    it("enables button and does not shows tooltip if canDownloadCoverage is true", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: true,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario({id: "s1"})]
        };
        const rendered = shallow(<ScenarioGroupComponent {...props}/>);
        expect(rendered.find("h3").text()).to.equal("Chicken pox");
        const row = rendered.find("li").at(0);
        const buttons = row.find(FileDownloadButton);

        expect(buttons.at(0).prop("href")).to.eq("/touchstones/t1/s1/coverage/csv/?format=long");
        expect(buttons.at(1).prop("href")).to.eq("/touchstones/t1/s1/coverage/csv/?format=wide");
        expect(row.find(UncontrolledTooltip)).to.have.lengthOf(0);

    });

    it("renders component if there are scenarios", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: true,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario({id: "s1"})]
        };
        const rendered = shallow(<ScenarioGroup {...props}/>);
        expect(rendered.find(ScenarioGroupComponent)).to.have.lengthOf(1);
    });

    it("render nothing if there are no scenarios", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: true,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: []
        };
        const rendered = shallow(<ScenarioGroup {...props}/>);
        expect(rendered.find(ScenarioGroupComponent)).to.have.lengthOf(0);
    });

});