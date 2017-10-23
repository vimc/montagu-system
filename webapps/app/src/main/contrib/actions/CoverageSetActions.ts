import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { ScenarioTouchstoneAndCoverageSets } from "../../shared/models/Generated";
import { alt } from "../../shared/alt";

interface Actions extends FetchActionsInterface<ScenarioTouchstoneAndCoverageSets> {
    selectFormat(format: string): string;
}

class CoverageSetActions extends FetchActions<ScenarioTouchstoneAndCoverageSets> implements Actions {

    selectFormat(format: string): string {
        return format;
    }
}

export const coverageSetActions = alt.createActions<Actions>(CoverageSetActions);
