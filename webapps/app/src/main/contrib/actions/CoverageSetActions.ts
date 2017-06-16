import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { ScenarioTouchstoneAndCoverageSets } from "../../shared/models/Generated";
import { alt } from "../../shared/alt";

interface Actions extends FetchActionsInterface<ScenarioTouchstoneAndCoverageSets> { }

class CoverageSetActions extends FetchActions<ScenarioTouchstoneAndCoverageSets> implements Actions {}

export const coverageSetActions = alt.createActions<Actions>(CoverageSetActions);
