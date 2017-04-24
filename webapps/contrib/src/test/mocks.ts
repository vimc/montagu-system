import * as sinon from 'sinon';

import { Location } from 'simple-react-router';
import * as models from '../main/Models';
import { Source } from '../main/sources/Source';

export function mockLocation(params?: any): Location<undefined> {
    return {
        hash: "hash",
        params: params || null,
        pathName: "/some/path",
        query: null
    };
}

export function mockResponsibility(properties?: any, scenarioProperties?: any): models.Responsibility {
    const scenarioTemplate: models.Scenario = {
        id: "scenario-id",
        description: "Description",
        disease: "Disease",
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

export function mockResponsibilitySet(
    properties?: any,
    responsibilities?: Array<models.Responsibility>
): models.Responsibilities 
{
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

export function mockSource<T>(source: Source<T>, data?: models.Result, errorMessage?: string) {
    data = data || {
        status: "success",
        data: {},
        errors: []
    };

    const response = {
        json: () => new Promise<any>(function(resolve, reject) {
            resolve(data);
        })
    };

    const promise = new Promise<Response>(function(resolve, reject) {        
        if (errorMessage) {
            reject(errorMessage);
        } else {
            resolve(response as Response);
        }
    });
    source.fetch = sinon.stub().returns(promise);
}

export function mockResult<T>(
        data: T, 
        errors?: Array<models.ErrorInfo>, 
        status?: models.ResultStatus
): models.Result 
{
    errors = errors || [];
    status = status || "success";

    return { data, errors, status };
}