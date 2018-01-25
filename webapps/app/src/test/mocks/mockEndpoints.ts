import {APIType, FakeEndpoint} from "./mockMultipleEndpoints";
import {
    CoverageSet,
    DemographicDataset, ModellingGroup, ModellingGroupDetails, ModelRunParameterSet, Report,
    ScenarioTouchstoneAndCoverageSets, Touchstone,
    User
} from "../../main/shared/models/Generated";
import {successResult} from "./mockRemote";
import {mockCoverageSet, mockResponsibility, mockResponsibilitySet, mockScenario} from "./mockModels";
import {Version} from "../../main/shared/models/reports/Report";

function makeFakeEndpoint(url: string, data: any, api: APIType): FakeEndpoint {
    return {
        urlFragment: new RegExp("^" + url + "$"),
        result: successResult(data),
        api: api
    }
}

export function mockTouchstonesEndpoint( touchstones: Touchstone[], groupId?: string): FakeEndpoint {
    return makeFakeEndpoint(`/modelling-groups/${groupId}/responsibilities/`, touchstones, APIType.Montagu);
}

export function mockDemographicDatasetsEndpoint(datasets: DemographicDataset[]): FakeEndpoint {
    return makeFakeEndpoint("/touchstones/.+/demographics/", datasets, APIType.Montagu);
}

export function mockResponsibilitiesEndpoint(scenarios: string[]): FakeEndpoint {
    const responsibilities = scenarios.map(id => mockResponsibility(null, mockScenario({id: id})));
    const set = mockResponsibilitySet(null, responsibilities);
    return makeFakeEndpoint("/modelling-groups/[^/]+/responsibilities/[^/]+/", set, APIType.Montagu);
}

export function mockCoverageSetsEndpoint(data: ScenarioTouchstoneAndCoverageSets): FakeEndpoint {
    return makeFakeEndpoint(`/modelling-groups/[^/]+/responsibilities/[^/]+/[^/]+/coverage-sets/`, data, APIType.Montagu);
}

export function mockModelRunParametersEndpoint(parameterSets: ModelRunParameterSet[]): FakeEndpoint {
    return makeFakeEndpoint(`/modelling-groups/[^/]+/model-run-parameters/[^/]+/`, parameterSets, APIType.Montagu);
}

export function mockUsersEndpoint(users: User[]): FakeEndpoint {
    return makeFakeEndpoint("/users/", users, APIType.Montagu);
}

export function mockGroupsEndpoint(groups: ModellingGroup[]): FakeEndpoint {
    return makeFakeEndpoint("/modelling-groups/", groups, APIType.Montagu);
}
export function mockGroupDetailsEndpoint(group: ModellingGroupDetails): FakeEndpoint {
    return makeFakeEndpoint("/modelling-groups/.+/", group, APIType.Montagu);
}

export function mockReportsEndpoint(reports: Report[]): FakeEndpoint {
    return makeFakeEndpoint("/reports/", reports, APIType.Reporting);
}
export function mockReportVersionsEndpoint(reportName: string, versions: Version[]): FakeEndpoint {
    return makeFakeEndpoint(`/reports/${reportName}/`, versions, APIType.Reporting)
}
export function mockReportDetailsEndpoint(details: Version): FakeEndpoint {
    return makeFakeEndpoint(`/reports/${details.name}/versions/${details.id}/`, details, APIType.Reporting)
}