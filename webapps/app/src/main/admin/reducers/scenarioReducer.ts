import {Scenario} from "../../shared/models/Generated";
import {ScenarioAction, ScenarioTypes} from "../actionTypes/ScenarioTypes";
import {orderBy} from "lodash";

export interface ScenarioState {
    scenarios: Scenario[]
}

export const initialScenarioState: ScenarioState = {
    scenarios: []
};

export const scenarioReducer = (state = initialScenarioState, action: ScenarioAction): ScenarioState => {
    switch (action.type) {
        case ScenarioTypes.SOME_SCENARIOS_FETCHED:
            let newScenarios = [...state.scenarios];
            for (let scenario of action.data) {
               if (!newScenarios.find(x => x.id == scenario.id)) {
                   newScenarios.push(scenario);
               }
            }
            newScenarios = orderBy(newScenarios, ['id'], ['asc']);
            return {... state, scenarios: newScenarios };
        default:
            return state;
    }
};
