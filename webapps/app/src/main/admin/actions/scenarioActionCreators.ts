import {Dispatch} from "redux";

import {AdminAppState} from "../reducers/adminAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {ScenarioTypes, SomeScenariosFetched} from "../actionTypes/ScenarioTypes";

export const scenarioActionCreators = {
    getScenariosForTouchstoneVersion(touchstoneVersionId: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const service = new TouchstonesService(dispatch, getState);
            const scenarios = await (service.getScenariosForTouchstoneVersion(touchstoneVersionId));
            dispatch({
                type: ScenarioTypes.SOME_SCENARIOS_FETCHED,
                data: scenarios.map(x => x.scenario)
            } as SomeScenariosFetched);
        }
    },
};
