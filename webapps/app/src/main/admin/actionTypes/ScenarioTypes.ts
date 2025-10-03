import {Scenario} from "../../shared/models/APITypes";

export enum ScenarioTypes {
    SOME_SCENARIOS_FETCHED = "SCENARIOS_FETCHED"
}

export interface SomeScenariosFetched {
    type: ScenarioTypes.SOME_SCENARIOS_FETCHED;
    data: Scenario[];
}

export type ScenarioAction =
    | SomeScenariosFetched
