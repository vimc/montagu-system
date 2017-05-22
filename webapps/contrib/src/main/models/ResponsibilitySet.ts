import {
    BurdenEstimate, CoverageSet, Responsibilities, Responsibility, ResponsibilitySetStatus, ResponsibilityStatus,
    Scenario,
    Touchstone
} from "./Generated";

export class ExtendedResponsibility {
    current_estimate: BurdenEstimate | null;
    problems: string[];
    scenario: Scenario;
    status: ResponsibilityStatus;
    coverageSets: CoverageSet[];

    constructor(x: Responsibility) {
        this.current_estimate = x.current_estimate;
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

    constructor(x: Responsibilities, touchstone: Touchstone) {
        this.problems = x.problems;
        this.responsibilities = x.responsibilities.map(r => new ExtendedResponsibility(r));
        this.status = x.status;
        this.touchstone = touchstone
    }

    getResponsibilityByScenario(scenarioId: string): ExtendedResponsibility {
        return this.responsibilities.find(x => x.scenario.id == scenarioId);
    }

    addCoverageSets(scenarioId: string, coverageSets: CoverageSet[]) {
        const responsibility = this.getResponsibilityByScenario(scenarioId);
        responsibility.coverageSets = coverageSets;
    }
}
