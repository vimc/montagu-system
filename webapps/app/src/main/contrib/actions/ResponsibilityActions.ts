import alt from "../../shared/alt";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { CoverageSet, Responsibilities, ScenarioTouchstoneAndCoverageSets, Touchstone } from "../../shared/models/Generated";
import {UploadEstimatesProps} from "../components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";

interface Actions extends FetchActionsInterface<Responsibilities> {
    filterByDisease(diseaseId: string): string;
    setCurrentResponsibility(scenarioId: string): string;
    setRedirectUrl(redirectUrl: string): string;
}

class ResponsibilityActions extends FetchActions<Responsibilities> implements Actions {
    filterByDisease(diseaseId: string): string {
        return diseaseId;
    }
    setCurrentResponsibility(scenarioId: string): string {
        return scenarioId;
    }
    setRedirectUrl(redirectUrl: string): string {
        return redirectUrl;
    }
}

export const responsibilityActions = alt.createActions<Actions>(ResponsibilityActions);

