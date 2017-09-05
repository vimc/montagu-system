import * as models from "../../main/shared/models/Generated";
import { ExtendedResponsibility, ExtendedResponsibilitySet } from "../../main/contrib/models/ResponsibilitySet";
import { Version } from "../../main/shared/models/reports/Report";
import { Artefact } from "../../main/shared/models/reports/Artefact";
import { DemographicStatisticType } from "../../main/shared/models/Generated";

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

export function mockModellingGroupDetails(properties?: any) {
    counter++;
    const template: models.ModellingGroupDetails = {
        id: "group-" + counter,
        description: "Description",
        models: [],
        admins: [ "user.a" ]
    };
    return Object.assign(template, properties);
}

export function mockResponsibility(properties?: any, scenario?: models.Scenario): models.Responsibility {
    const template: models.Responsibility = {
        current_estimate: null,
        problems: [],
        scenario: scenario || mockScenario(),
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
        status: "open"
    };
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
    };
    return Object.assign(template, properties);
}

export function mockExtendedResponsibilitySet(
    properties?: any,
    responsibilities?: Array<models.Responsibility>,
    touchstone?: models.Touchstone,
    modellingGroup?: models.ModellingGroup
): ExtendedResponsibilitySet
{
    touchstone = touchstone || mockTouchstone();
    modellingGroup = modellingGroup || mockModellingGroup();
    properties = Object.assign(properties || {}, { touchstone: touchstone.id });
    const values = mockResponsibilitySet(properties, responsibilities);
    return new ExtendedResponsibilitySet(values, touchstone, modellingGroup);
}

export function mockCoverageSet(properties?: any): models.CoverageSet {
    const template: models.CoverageSet = {
        id: 100,
        name: "Coverage set name",
        activity_type: "routine",
        gavi_support: "no gavi",
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

export function mockRole(): models.RoleAssignment {
    counter++;
    return {
        name: "mockRole" + counter,
        scope_prefix: null,
        scope_id: null
    };
}

export function mockUser(properties?: any): models.User {
    counter++;
    return Object.assign({
        username: "mock.user" + counter,
        name: "Mockery Jones",
        email: "mock@example.com",
        roles: [ mockRole(), mockRole() ],
        last_logged_in: null
    }, properties);
}

export function mockVersion(properties?: any): Version {

    const template: Version = {
        id: "vId",
        name: "testname",
        displayname : "testdisplayname",
        date: "2017-01-01",
        data: {},
        hash_data: {},
        artefacts: [{}],
        resources: [],
        parameters: {}
    };
    return Object.assign(template, properties);
}

export function mockArtefact(properties?: any): Artefact {

    const template: Artefact = {
        filenames: [ "filename1.csv", "filename2.html" ],
        description: "description"
    };

    return Object.assign(template, properties);
}

export function mockDemographicStatisticType(properties?: Partial<models.DemographicStatisticType>): models.DemographicStatisticType {
    counter++;
    const template: DemographicStatisticType = {
        id: "type-" + counter,
        name: "Type " + counter,
        gender_is_applicable: true,
        countries: [ "AFG", "AGO" ],
        sources: [ "source1", "source2" ]
    };
    return Object.assign(template, properties);
}