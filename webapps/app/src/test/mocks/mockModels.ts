import * as models from "../../main/shared/models/Generated";
import {ExtendedResponsibility, ExtendedResponsibilitySet} from "../../main/contrib/models/ResponsibilitySet";
import {Version} from "../../main/shared/models/reports/Report";
import {Artefact} from "../../main/shared/models/reports/Artefact";
import {Report} from "../../main/shared/models/Generated";
import {PageBreadcrumb} from "../../main/shared/components/PageWithHeader/PageWithHeader";

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

export function mockModellingGroup(properties?: Partial<models.ModellingGroup>) {
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
        members: ["user.a"]
    };
    return Object.assign(template, properties);
}

export function mockResponsibility(properties?: any, scenario?: models.Scenario): models.Responsibility {
    const template: models.Responsibility = {
        current_estimate_set: null,
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
        responsibilities = [mockResponsibility(), mockResponsibility()];
    }

    const template: models.Responsibilities = {
        problems: "",
        responsibilities: responsibilities,
        status: "incomplete",
        touchstone: "touchstone-1"
    };
    return Object.assign(template, properties);
}

export function mockExtendedResponsibilitySet(properties?: any,
                                              responsibilities?: Array<models.Responsibility>,
                                              touchstone?: models.Touchstone,
                                              modellingGroup?: models.ModellingGroup): ExtendedResponsibilitySet {
    touchstone = touchstone || mockTouchstone();
    modellingGroup = modellingGroup || mockModellingGroup();
    properties = Object.assign(properties || {}, {touchstone: touchstone.id});
    const values = mockResponsibilitySet(properties, responsibilities);
    return new ExtendedResponsibilitySet(values, touchstone, modellingGroup);
}

export function mockCoverageSet(properties?: Partial<models.CoverageSet>): models.CoverageSet {
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

export function mockScenarioTouchstoneAndCoverageSets(scenarioProperties?: Partial<models.Scenario>,
                                                      touchstoneProperties?: Partial<models.Touchstone>,
                                                      coverageSets?: models.CoverageSet[]): models.ScenarioTouchstoneAndCoverageSets {
    const touchstone = mockTouchstone(touchstoneProperties);
    return {
        touchstone: touchstone,
        scenario: mockScenario(scenarioProperties),
        coverage_sets: coverageSets || [mockCoverageSet({touchstone: touchstone.id})]
    };
}

export function mockRole(properties?: any): models.RoleAssignment {
    counter++;
    return Object.assign({
        name: "mockRole" + counter,
        scope_prefix: null,
        scope_id: null
    }, properties);
}

export function mockUser(properties?: any): models.User {
    counter++;
    return Object.assign({
        username: "mock.user" + counter,
        name: "Mockery Jones",
        email: "mock@example.com",
        roles: [mockRole(), mockRole()],
        last_logged_in: null
    }, properties);
}

export function mockVersion(properties?: Partial<Version>): Version {

    const template: Version = {
        id: "vId",
        name: "testname",
        displayname: "testdisplayname",
        date: "2017-01-01",
        data: {},
        hash_data: {},
        artefacts: [{}],
        resources: [],
        parameters: {},
        published: true
    };
    return Object.assign(template, properties);
}

export function mockArtefact(properties?: Partial<Artefact>): Artefact {

    const template: Artefact = {
        filenames: ["filename1.csv", "filename2.html"],
        description: "description"
    };

    return Object.assign(template, properties);
}

export function mockReport(properties?: Partial<Report>): Report {

    const template: Report = {
        name: "report",
        display_name: "display name",
        latest_version: "e62871eydhsjkh"
    };

    return Object.assign(template, properties);
}

export function mockDemographicDataset(properties?: Partial<models.DemographicDataset>): models.DemographicDataset {
    counter++;
    const template: models.DemographicDataset = {
        id: "type-" + counter,
        name: "Type " + counter,
        gender_is_applicable: true,
        source: "source1"
    };
    return Object.assign(template, properties);
}

export function mockBurdenEstimateSet(properties?: Partial<models.BurdenEstimateSet>): models.BurdenEstimateSet {
    counter++;
    const template: models.BurdenEstimateSet = {
        id: counter,
        problems: [],
        uploaded_by: "test.user",
        uploaded_on: "2017-07-13 13:55:29 +0100",
        type: {
            type: "central-single-run",
            details: "Run number 64"
        },
        status: "complete"
    };
    return Object.assign(template, properties);
}

export function mockModelRunParameterSet(properties?: Partial<models.ModelRunParameterSet>): models.ModelRunParameterSet {
    counter++;
    const template: models.ModelRunParameterSet = {
        id: counter,
        disease: "Yellow Fever",
        model: "model-1",
        uploaded_on: "2017-07-13 13:45:29 +0100",
        uploaded_by: "test.user"
    };
    return Object.assign(template, properties);
}

export function mockPageBreadcrumb() {
    return {
        name: "A",
        urlFragment: "/",
        parent: null
    } as PageBreadcrumb;
}

export function mockBreadcrumbs() {
    return [ { url: '/', name: 'A' }, { url: '/b/', name: 'B' } ];
}