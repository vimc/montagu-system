import * as models from "../../main/shared/models/Generated";
import {
    ExpectationMapping,
    ModellingGroupCreation,
    TouchstoneVersion
} from "../../main/shared/models/Generated";
import {ExtendedResponsibility, ExtendedResponsibilitySet} from "../../main/contrib/models/ResponsibilitySet";
import {PageBreadcrumb} from "../../main/shared/components/PageWithHeader/PageProperties";

let counter = 0;

export function mockDisease(properties?: any): models.Disease {
    counter++;
    return Object.assign({
        id: `disease-${counter}`,
        name: `Disease ${counter}`,
    }, properties);
}

export function mockScenario(properties?: Partial<models.Scenario>): models.Scenario {
    counter++;
    const template: models.Scenario = {
        id: `scenario-${counter}`,
        description: "Description",
        disease: "disease-id",
        touchstones: []
    };
    return Object.assign(template, properties);
}

export function mockModelVersion(properties?: Partial<models.ModelVersion>) {
    counter++;
    const template: models.ModelVersion = {
        id: counter,
        fingerprint: null,
        is_dynamic: false,
        model: "model",
        note: null,
        code: "R",
        version: "v-" + counter,
        countries: []
    };

    return Object.assign(template, properties);
}

export function mockModel(properties?: Partial<models.ResearchModelDetails>) {
    counter++;
    const template: models.ResearchModelDetails = {
        id: "model-" + counter,
        description: "Description",
        citation: "citation",
        modelling_group: "group-" + counter,
        gender: null,
        gender_specific: false,
        current_version: mockModelVersion()
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


export function mockModellingGroupCreation(properties?: Partial<ModellingGroupCreation>) {
    counter++;
    const template: models.ModellingGroupCreation = {
        id: "group-" + counter,
        description: "Description",
        institution: "Imperial",
        pi: "Principal Investigator"
    };
    return Object.assign(template, properties);
}

export function mockResponsibility(properties?: Partial<models.Responsibility>, scenario?: models.Scenario): models.Responsibility {
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

export function mockTouchstone(properties?: Partial<models.Touchstone>, versions?: models.TouchstoneVersion[]) {
    counter++;
    const template: models.Touchstone = {
        id: "touchstone" + counter,
        description: "Description of touchstone",
        comment: "Comment",
        versions: []
    };
    const touchstone = Object.assign(template, properties);
    touchstone.versions = versions || [
        mockTouchstoneVersion({id: touchstone.id + "-" + 1, name: touchstone.id, version: 1}),
        mockTouchstoneVersion({id: touchstone.id + "-" + 2, name: touchstone.id, version: 2})
    ];
    return touchstone;
}

export function mockTouchstoneVersion(properties?: Partial<TouchstoneVersion>): models.TouchstoneVersion {
    counter++;
    const template: models.TouchstoneVersion = {
        id: "touchstone-" + counter,
        name: "touchstone",
        version: 1,
        description: "Description",
        status: "open"
    };
    return Object.assign(template, properties);
}

export function mockCountry(properties?: Partial<models.Country>): models.Country {
    counter++;
    const template: models.Country = {
        id: "ABC-" + counter,
        name: "CountryName-" + counter
    };
    return Object.assign(template, properties);
}

export function mockExpectations(properties?: Partial<models.Expectations>): models.Expectations {
    counter++;
    const template: models.Expectations = {
        id: counter,
        description: "description",
        ages: {minimum_inclusive: 0, maximum_inclusive: 99},
        years: {minimum_inclusive: 2000, maximum_inclusive: 2100},
        cohorts: {minimum_birth_year: 2000, maximum_birth_year: 2050},
        countries: [mockCountry(), mockCountry()],
        outcomes: ["deaths", "cases"]
    };
    return Object.assign(template, properties);
}

export function mockExpectationMapping(
    properties?: Partial<models.Expectations>,
    applicableScenarios?: string[],
    disease?: string
): ExpectationMapping {
    return {
        disease: disease || "YF",
        expectation: mockExpectations(properties),
        applicable_scenarios: applicableScenarios || ["scenario-1", "scenario-2"]
    };
}

export function mockResponsibilitySetWithExpectations(
    properties?: Partial<models.ResponsibilitySetWithExpectations>,
    responsibilities?: Array<models.Responsibility>
): models.ResponsibilitySetWithExpectations {
    if (!responsibilities || responsibilities.length == 0) {
        responsibilities = [mockResponsibility(), mockResponsibility()];
    }

    const template: models.ResponsibilitySetWithExpectations = {
        responsibilities: responsibilities,
        status: "incomplete",
        touchstone_version: "touchstone-1",
        modelling_group_id: "g1",
        expectations: []
    };
    return Object.assign(template, properties);
}

export function mockExtendedResponsibilitySet(
    properties?: Partial<models.ResponsibilitySetWithExpectations>,
    responsibilities?: Array<models.Responsibility>,
    touchstone?: models.TouchstoneVersion,
    modellingGroup?: models.ModellingGroup
): ExtendedResponsibilitySet {
    touchstone = touchstone || mockTouchstoneVersion();
    modellingGroup = modellingGroup || mockModellingGroup();
    properties = Object.assign(properties || {}, {touchstone: touchstone.id});
    const values = mockResponsibilitySetWithExpectations(properties, responsibilities,);
    return new ExtendedResponsibilitySet(values, touchstone, modellingGroup);
}

export function mockCoverageSet(properties?: Partial<models.CoverageSet>): models.CoverageSet {
    const template: models.CoverageSet = {
        id: 100,
        name: "Coverage set name",
        activity_type: "routine",
        gavi_support: "no gavi",
        touchstone_version: "touchstone-1",
        vaccine: "some-vaccine"
    };
    return Object.assign(template, properties);
}

export function mockScenarioAndCoverageSets(
    scenarioProperties?: Partial<models.Scenario>,
    coverageSets?: models.CoverageSet[]
): models.ScenarioAndCoverageSets {
    return {
        scenario: mockScenario(scenarioProperties),
        coverage_sets: coverageSets || [mockCoverageSet()]
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
    return [{url: '/', name: 'A'}, {url: '/b/', name: 'B'}];
}