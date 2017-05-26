import { FetchActions, FetchActionsInterface } from "./FetchActions";
import { ScenarioTouchstoneAndCoverageSets } from "../models/Generated";
import { alt } from "../alt";

interface Actions extends FetchActionsInterface<ScenarioTouchstoneAndCoverageSets> { }

class CoverageSetActions extends FetchActions<ScenarioTouchstoneAndCoverageSets> implements Actions {}

export const coverageSetActions = alt.createActions<Actions>(CoverageSetActions);
