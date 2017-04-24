import * as sinon from 'sinon';

import { Location } from 'simple-react-router';
import { Responsibility, Scenario, Touchstone, Responsibilities } from '../main/Models';
import { Source } from '../main/sources/Source';

export function mockLocation(params?: any): Location<undefined> {
    return {
        hash: "hash",
        params: params || null,
        pathName: "/some/path",
        query: null
    };
}

export function mockResponsibility(properties?: any, scenarioProperties?: any): Responsibility {
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

export function mockTouchstone(properties?: any): Touchstone {
    const template: Touchstone = {
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

export function mockResponsibilitySet(properties?: any, responsibilities?: Array<Responsibility>): Responsibilities {
    if (!responsibilities || responsibilities.length == 0) {
        responsibilities = [ mockResponsibility(), mockResponsibility() ];
    }

    const template: Responsibilities = {
        problems: "",
        responsibilities: responsibilities,
        status: "incomplete",
        touchstone: "touchstone-1"
    }
    return Object.assign(template, properties);
}

export function mockSource<T>(source: Source<T>) {
    const mockPromise: any = { };
    mockPromise.then = (x: any) => mockPromise;
    mockPromise.catch = (x: any) => mockPromise;
    source.fetch = sinon.stub().returns(mockPromise);
}