import * as models from "../../main/contrib/models/Generated";
import { ExtendedResponsibility, ExtendedResponsibilitySet } from "../../main/contrib/models/ResponsibilitySet";

let counter = 0;
export function mockDisease(properties?: any): models.Disease {
    counter++;
    return Object.assign({
        id: `disease-${counter}`,
        name: `Disease ${counter}`,
    }, properties);
}

export function mockScenario(properties?: any): models.Scenario {
    const template: models.Scenario = {
        id: "scenario-id",
        description: "Description",
        disease: "disease-id",
        touchstones: []
    };
    return Object.assign(template, properties);
}

export function mockModellingGroup(properties?: any) {
    counter++;
    const template: models.ModellingGroup = {
        id: "group-" + counter,
        description: "Description"
    };
    return Object.assign(template, properties);
}

export function mockResponsibility(properties?: any, scenarioProperties?: any): models.Responsibility {
    const template: models.Responsibility = {
        current_estimate: null,
        problems: [],
        scenario: mockScenario(scenarioProperties),
        status: "empty"
    };
    return Object.assign(template, properties);
}
export function mockExtendedResponsibility(properties?: any, scenarioProperties?: any): ExtendedResponsibility {
    const values = mockResponsibility(properties, scenarioProperties);
    return new ExtendedResponsibility(values);
}

export function mockTouchstone(properties?: any): models.Touchstone {
    counter++;
    const template: models.Touchstone = {
        id: "touchstone-" + counter,
        name: "touchstone",
        version: 1,
        description: "Description",
        status: "open",
        years: {
            start: 1970,
            end: 2100
        }
    }
    return Object.assign(template, properties);
}

export function mockResponsibilitySet(properties?: any,
                                      responsibilities?: Array<models.Responsibility>): models.Responsibilities {
    if (!responsibilities || responsibilities.length == 0) {
        responsibilities = [ mockResponsibility(), mockResponsibility() ];
    }

    const template: models.Responsibilities = {
        problems: "",
        responsibilities: responsibilities,
        status: "incomplete",
        touchstone: "touchstone-1"
    }
    return Object.assign(template, properties);
}

export function mockExtendedResponsibilitySet(
    properties?: any,
    responsibilities?: Array<models.Responsibility>,
    touchstone?: models.Touchstone
): ExtendedResponsibilitySet
{
    touchstone = touchstone || mockTouchstone();
    properties = Object.assign(properties, { touchstone: touchstone.id });
    const values = mockResponsibilitySet(properties, responsibilities);
    return new ExtendedResponsibilitySet(values, touchstone);
}

export function mockCoverageSet(properties?: any): models.CoverageSet {
    const template: models.CoverageSet = {
        id: 100,
        name: "Coverage set name",
        activity_type: "routine",
        gavi_support_level: "without",
        touchstone: "touchstone-1",
        vaccine: "some-vaccine"
    };
    return Object.assign(template, properties);
}

export function mockScenarioTouchstoneAndCoverageSets(
    scenarioProperties?: any,
    touchstoneProperties?: any,
    coverageSets?: models.CoverageSet[]
): models.ScenarioTouchstoneAndCoverageSets
{
    const touchstone =  mockTouchstone(touchstoneProperties);
    return {
        touchstone: touchstone,
        scenario: mockScenario(scenarioProperties),
        coverage_sets: coverageSets || [ mockCoverageSet({ touchstone: touchstone.id }) ]
    };
}