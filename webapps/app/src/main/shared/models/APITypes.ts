export interface AssociateRole {
    action: string;
    name: string;
    scope_id: string | null;
    scope_prefix: string | null;
}

export interface AssociateUser {
    action: string;
    username: string;
}

export interface CohortRestriction {
    maximum_birth_year: number | null;
    minimum_birth_year: number | null;
}

export type ActivityType = "none" | "routine" | "campaign" | "campaign-reactive";

export type GAVISupportLevel = "no vaccine" | "no gavi" | "total" | "high" | "low" | "bestcase" | "status-quo" | "continue" | "gavi-optimistic" | "intensified" | "hold2010" | "bestminus";

export interface CoverageSet {
    activity_type: ActivityType;
    gavi_support: GAVISupportLevel;
    id: number;
    name: string;
    touchstone_version: string;
    vaccine: string;
}

export interface CoverageUploadMetadata {
    activity_type: string;
    uploaded_by: string;
    uploaded_on: string;
    vaccine: string;
}

export interface Country {
    id: string;
    name: string;
}

export type BurdenEstimateSetTypeCode = "central-single-run" | "central-averaged" | "central-unknown" | "stochastic";

export interface BurdenEstimateSetType {
    details: string | null;
    type: BurdenEstimateSetTypeCode;
}

export interface CreateBurdenEstimateSet {
    model_run_parameter_set: number | null;
    type: BurdenEstimateSetType;
}

export interface Disease {
    id: string;
    name: string;
}

export interface DemographicDataset {
    gender_is_applicable: boolean;
    id: string;
    name: string;
    source: string;
}

export interface NumberRange {
    maximum_inclusive: number;
    minimum_inclusive: number;
}

export interface ModellingGroup {
    description: string;
    id: string;
}

export interface ResearchModel {
    citation: string;
    description: string;
    id: string;
    modelling_group: string;
}

export interface ModellingGroupDetails {
    description: string;
    id: string;
    members: string[];
    models: ResearchModel[];
}

export interface ModellingGroupCreation {
    description: string;
    id: string;
    institution: string;
    pi: string;
}

export interface ModelRunParameterSet {
    disease: string;
    id: number;
    model: string;
    uploaded_by: string;
    uploaded_on: string;
}

export interface ModelVersion {
    code: string | null;
    countries: Country[];
    fingerprint: string | null;
    id: number;
    is_dynamic: boolean | null;
    model: string;
    note: string | null;
    version: string;
}

export interface ResearchModelDetails {
    citation: string;
    current_version: ModelVersion | null;
    description: string;
    disease: Disease;
    gender: string | null;
    gender_specific: boolean | null;
    id: string;
    modelling_group: string;
}

export interface ResponsibilityCommentPayload {
    comment: string;
}

export interface ResponsibilityComment {
    added_by: string;
    added_on: string;
    comment: string;
}

export interface ResponsibilityWithComment {
    comment: ResponsibilityComment | null;
    scenario_id: string;
}

export interface ResponsibilitySetWithComments {
    comment: ResponsibilityComment | null;
    modelling_group_id: string;
    responsibilities: ResponsibilityWithComment[];
    touchstone_version: string;
}

export interface Outcome {
    code: string;
    name: string;
}

export interface Expectations {
    ages: NumberRange;
    cohorts: CohortRestriction;
    description: string;
    id: number;
    outcomes: Outcome[];
    years: NumberRange;
}

export interface AppliedExpectation {
    applicable_scenarios: string[];
    disease: string;
    expectation: Expectations;
}

export interface CountryOutcomeExpectations extends Expectations {
    ages: NumberRange;
    cohorts: CohortRestriction;
    countries: Country[];
    description: string;
    id: number;
    outcomes: Outcome[];
    years: NumberRange;
}

export interface ExpectationMapping extends AppliedExpectation {
    applicable_scenarios: string[];
    disease: string;
    expectation: CountryOutcomeExpectations;
}

export type BurdenEstimateSetStatus = "empty" | "partial" | "complete" | "invalid";

export interface BurdenEstimateSet {
    id: number;
    original_filename: string | null;
    problems: string[];
    status: BurdenEstimateSetStatus;
    type: BurdenEstimateSetType;
    uploaded_by: string;
    uploaded_on: string;
}

export interface Scenario {
    description: string;
    disease: string;
    id: string;
    touchstones: string[];
}

export type ResponsibilityStatus = "empty" | "invalid" | "valid";

export interface Responsibility {
    current_estimate_set: BurdenEstimateSet | null;
    problems: string[];
    scenario: Scenario;
    status: ResponsibilityStatus;
}

export type ResponsibilitySetStatus = "not-applicable" | "incomplete" | "submitted" | "approved";

export interface ResponsibilitySetWithExpectations {
    expectations: ExpectationMapping[];
    modelling_group_id: string;
    responsibilities: Responsibility[];
    status: ResponsibilitySetStatus | null;
    touchstone_version: string;
}

export interface ErrorInfo {
    code: string;
    message: string;
}

export type ResultStatus = "success" | "failure";

export interface Result {
    data: any;
    errors: ErrorInfo[];
    status: ResultStatus;
}

export interface ScenarioAndCoverageSets {
    coverage_sets: CoverageSet[] | null;
    scenario: Scenario;
}

export type TouchstoneStatus = "in-preparation" | "open" | "finished";

export interface TouchstoneVersion {
    description: string;
    id: string;
    name: string;
    status: TouchstoneStatus;
    version: number;
}

export interface ScenarioTouchstoneAndCoverageSets {
    coverage_sets: CoverageSet[] | null;
    scenario: Scenario;
    touchstone_version: TouchstoneVersion;
}

export interface Touchstone {
    comment: string;
    description: string;
    id: string;
    versions: TouchstoneVersion[];
}

export interface OutcomeExpectations extends Expectations {
    ages: NumberRange;
    cohorts: CohortRestriction;
    description: string;
    id: number;
    outcomes: Outcome[];
    years: NumberRange;
}

export interface TouchstoneModelExpectations extends AppliedExpectation {
    applicable_scenarios: string[];
    disease: string;
    expectation: OutcomeExpectations;
    modelling_group: string;
    touchstone_version: string;
}

export interface RoleAssignment {
    name: string;
    scope_id: string | null;
    scope_prefix: string | null;
}

export interface User {
    email: string;
    last_logged_in: string;
    name: string;
    permissions: string[] | null;
    roles: RoleAssignment[] | null;
    username: string;
}