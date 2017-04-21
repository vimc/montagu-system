import { Location } from 'simple-react-router';
export function mockLocation(): Location<undefined> {
    return {
        hash: "hash",
        params: undefined,
        pathName: "/some/path",
        query: null
    };
}

import { Responsibility, Scenario } from '../main/Models';
export function mockResponsibility(properties: any, scenarioProperties: any): Responsibility {
    const scenarioTemplate: Scenario = {
        id: "scenario-id",
        description: "Description",
        disease: "Disease",
        touchstones: []
    };
    const template: Responsibility = {
           current_estimate: null,
           problems: [],
           scenario: Object.assign(scenarioTemplate, scenarioProperties),
           status: "empty"
    };
    return Object.assign(template, properties);
}