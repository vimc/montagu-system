import * as models from "../../main/models/Generated";

let counter = 0;
export function mockDisease(properties?: any): models.Disease {
    counter++;
    return Object.assign({
        id: `disease-${counter}`,
        name: `Disease ${counter}`,
    }, properties);
}

export function mockResponsibility(properties?: any, scenarioProperties?: any): models.Responsibility {
    const scenarioTemplate: models.Scenario = {
        id: "scenario-id",
        description: "Description",
        disease: "disease-id",
        touchstones: []
    };
    const template: models.Responsibility = {
        current_estimate: null,
        problems: [],
        scenario: Object.assign(scenarioTemplate, scenarioProperties),
        status: "empty"
    };
    return Object.assign(template, properties);
}

export function mockTouchstone(properties?: any): models.Touchstone {
    const template: models.Touchstone = {
        id: "touchstone-1",
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