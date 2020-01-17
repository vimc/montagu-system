import {mockDisease, mockScenario} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import * as React from "react";

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
        expect(rendered.find("h3").text()).toEqual("Chicken pox");
        const rows = rendered.find("li");
        expect(rows).toHaveLength(2);
    });

    it(
        "disables button and shows permission tooltip if canDownloadCoverage is false",
        () => {
            const props: ScenarioGroupProps = {
                touchstoneVersionId: "t1",
                canDownloadCoverage: false,
                disease: mockDisease({name: "Chicken pox"}),
                scenarios: [mockScenario()]
            };
            const rendered = shallow(<ScenarioGroupComponent {...props}/>);
            expect(rendered.find("h3").text()).toEqual("Chicken pox");
            const row = rendered.find("li").at(0);
            const buttons = row.find(FileDownloadButton);

            expect(buttons).toHaveLength(2);

            buttons.forEach(button =>
                { expect(button.prop("href")).toBe(null); }
            );

            expect(row.find('.download-permission-tooltip')).toHaveLength(1)

        }
    );


    it("does not show format tooltips if canDownloadCoverage is false", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: false,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario()]
        };
        const rendered = shallow(<ScenarioGroupComponent {...props}/>);
        expect(rendered.find("h3").text()).toEqual("Chicken pox");
        const row = rendered.find("li").at(0);

        expect(row.find('.download-format-tooltip')).toHaveLength(0);

    });

    it(
        "enables button and does not show permission tooltip if canDownloadCoverage is true",
        () => {
            const props: ScenarioGroupProps = {
                touchstoneVersionId: "t1",
                canDownloadCoverage: true,
                disease: mockDisease({name: "Chicken pox"}),
                scenarios: [mockScenario({id: "s1"})]
            };
            const rendered = shallow(<ScenarioGroupComponent {...props}/>);
            expect(rendered.find("h3").text()).toEqual("Chicken pox");
            const row = rendered.find("li").at(0);
            const buttons = row.find(FileDownloadButton);

            expect(buttons.at(0).prop("href")).toEqual("/touchstones/t1/s1/coverage/csv/?format=long");
            expect(buttons.at(1).prop("href")).toEqual("/touchstones/t1/s1/coverage/csv/?format=wide");
            expect(row.find('.download-permission-tooltip')).toHaveLength(0);

        }
    );

    it("shows format tooltips if canDownloadCoverage is true", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: true,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario({id: "s1"})]
        };
        const rendered = shallow(<ScenarioGroupComponent {...props}/>);
        expect(rendered.find("h3").text()).toEqual("Chicken pox");
        const row = rendered.find("li").at(0);
        expect(row.find('.download-format-tooltip')).toHaveLength(2);

    });

    it("renders component if there are scenarios", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: true,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: [mockScenario({id: "s1"})]
        };
        const rendered = shallow(<ScenarioGroup {...props}/>);
        expect(rendered.find(ScenarioGroupComponent)).toHaveLength(1);
    });

    it("render nothing if there are no scenarios", () => {
        const props: ScenarioGroupProps = {
            touchstoneVersionId: "t1",
            canDownloadCoverage: true,
            disease: mockDisease({name: "Chicken pox"}),
            scenarios: []
        };
        const rendered = shallow(<ScenarioGroup {...props}/>);
        expect(rendered.find(ScenarioGroupComponent)).toHaveLength(0);
    });

});