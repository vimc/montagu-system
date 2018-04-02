import alt from "../../shared/alt";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { CoverageSet, Responsibilities, ScenarioTouchstoneAndCoverageSets, Touchstone } from "../../shared/models/Generated";
// import {UploadEstimatesProps} from "../components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";

interface Actions extends FetchActionsInterface<Responsibilities> {
    filterByDisease(diseaseId: string): string;
    setCurrentResponsibility(scenarioId: string): string;
    refreshResponsibilities(): boolean
}

class ResponsibilityActions extends FetchActions<Responsibilities> implements Actions {
    filterByDisease(diseaseId: string): string {
        return diseaseId;
    }
    setCurrentResponsibility(scenarioId: string): string {
        return scenarioId;
    }
    refreshResponsibilities(): boolean {
        return true;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

