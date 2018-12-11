import {Dispatch} from "redux";

import {EstimatesService} from "../services/EstimatesService";
import {responsibilitiesActionCreators} from "./responsibilitiesActionCreators";
import {mapStateToPropsHelper} from "../helpers/mapStateToPropsHelper";
import {ContribAppState} from "../reducers/contribAppReducers";
import {CreateBurdenEstimateSet} from "../../shared/models/Generated";
import {BurdenOutcome, EstimateTypes} from "../actionTypes/EstimateTypes";

export const estimatesActionCreators = {
    createBurden(data: CreateBurdenEstimateSet) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());

            await (new EstimatesService(dispatch, getState)).createBurden(ids.groupId, ids.touchstoneId, ids.scenarioId, data);
            dispatch(responsibilitiesActionCreators.refreshResponsibilities());
        }
    },
    getEstimates(outcome: BurdenOutcome, setId: number) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());

            const data = await (new EstimatesService(dispatch, getState)).getEstimates(ids.groupId, ids.touchstoneId,
                ids.scenarioId, setId, outcome);

            return dispatch({
                type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
                data: data
            });
        }
    }
};
