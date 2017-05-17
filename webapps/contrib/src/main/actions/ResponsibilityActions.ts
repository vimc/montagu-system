import alt from "../alt";
import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { CoverageSet, Responsibilities, ScenarioTouchstoneAndCoverageSets, Touchstone } from "../models/Generated";

interface Actions extends FetchActionsInterface<Responsibilities> {
    filterByDisease(diseaseId: string): string;
    setCurrentResponsibility(scenarioId: string): string;
    beginFetchCoverageSets(): boolean;
    updateCoverageSets(data: ScenarioTouchstoneAndCoverageSets): ScenarioTouchstoneAndCoverageSets;
}

class ResponsibilityActions extends FetchActions<Responsibilities> implements Actions {
    updateResponsibilities(responsibilitySet: Responsibilities): Responsibilities {
        return responsibilitySet;
    }

    filterByDisease(diseaseId: string): string {
        return diseaseId;
    }
    setCurrentResponsibility(scenarioId: string): string {
        return scenarioId;
    }

    beginFetchCoverageSets(): boolean {
        return true;
    }
    updateCoverageSets(data: ScenarioTouchstoneAndCoverageSets): ScenarioTouchstoneAndCoverageSets {
        return data;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

