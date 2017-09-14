import {
    BurdenEstimateSet, CoverageSet, ModellingGroup, Responsibilities, Responsibility, ResponsibilitySetStatus,
    ResponsibilityStatus,
    Scenario,
    Touchstone
} from "../../shared/models/Generated";

export class ExtendedResponsibility {
    current_estimate_set: BurdenEstimateSet | null;
    problems: string[];
    scenario: Scenario;
    status: ResponsibilityStatus;
    coverageSets: CoverageSet[];

    constructor(x: Responsibility) {
        this.current_estimate_set = x.current_estimate_set;
        this.problems = x.problems;
        this.scenario = x.scenario;
        this.status = x.status;
        this.coverageSets = null;
    }
}

export interface IExtendedResponsibilitySet {
    problems: string;
    responsibilities: ExtendedResponsibility[];
    status: ResponsibilitySetStatus | null;
    touchstone: Touchstone;
}

export class ExtendedResponsibilitySet implements IExtendedResponsibilitySet {
    problems: string;
    responsibilities: ExtendedResponsibility[];
    status: ResponsibilitySetStatus | null;
    touchstone: Touchstone;
    modellingGroup: ModellingGroup;

    constructor(x: Responsibilities, touchstone: Touchstone, modellingGroup: ModellingGroup) {
        this.problems = x.problems;
        this.responsibilities = x.responsibilities.map(r => new ExtendedResponsibility(r));
        this.status = x.status;
        this.touchstone = touchstone;
        this.modellingGroup = modellingGroup;
    }

    getResponsibilityByScenario(scenarioId: string): ExtendedResponsibility {
        return this.responsibilities.find(x => x.scenario.id == scenarioId);
    }

    addCoverageSets(scenarioId: string, coverageSets: CoverageSet[]) {
        const responsibility = this.getResponsibilityByScenario(scenarioId);
        responsibility.coverageSets = coverageSets;
    }

    getCoverageSets(scenarioId: string): CoverageSet[] {
        const responsibility = this.getResponsibilityByScenario(scenarioId);
        return responsibility.coverageSets;
    }
}
