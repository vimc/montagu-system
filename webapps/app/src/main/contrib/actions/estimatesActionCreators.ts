import {Dispatch} from "redux";

import {EstimatesService} from "../services/EstimatesService";
import {responsibilitiesActionCreators} from "./responsibilitiesActionCreators";
import {mapStateToPropsHelper} from "../helpers/mapStateToPropsHelper";
import {ContribAppState} from "../reducers/contribAppReducers";
import {BurdenEstimateSetStatus, CreateBurdenEstimateSet, Result, ResultStatus} from "../../shared/models/Generated";
import {BurdenOutcome, Estimates, EstimateTypes} from "../actionTypes/EstimateTypes";
import BurdenEstimatesFetched = Estimates.BurdenEstimatesFetched;
import UploadTokenFetched = Estimates.UploadTokenFetched;
import EstimateSetPopulated = Estimates.EstimateSetPopulated;
import ResetPopulateState = Estimates.ResetPopulateState;
import PopulatingEstimateSet = Estimates.PopulatingEstimateSet;

export const estimatesActionCreators = {
    createBurden(data: CreateBurdenEstimateSet) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());

            await (new EstimatesService(dispatch, getState)).createBurden(ids.groupId, ids.touchstoneId, ids.scenarioId, data);
            dispatch(responsibilitiesActionCreators.refreshResponsibilities());
        }
    },
    getUploadToken() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());
            const token = await (new EstimatesService(dispatch, getState))
                .getUploadToken(ids.groupId, ids.touchstoneId, ids.scenarioId, ids.estimateSetId);

            dispatch({
                type: EstimateTypes.UPLOAD_TOKEN_FETCHED,
                data: token
            } as UploadTokenFetched);
        }
    },
    populateEstimateSet(uploadToken: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            dispatch({
                type: EstimateTypes.POPULATING_ESTIMATES,
                data: true
            } as PopulatingEstimateSet);

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());

            const result = await (new EstimatesService(dispatch, getState))
                .populateEstimatesFromFile(ids.groupId, ids.touchstoneId, ids.scenarioId, ids.estimateSetId, uploadToken);

            dispatch(this._estimateSetPopulated(result));
            dispatch(responsibilitiesActionCreators.refreshResponsibilities())
        }
    },

    _estimateSetPopulated(result: String | Result): EstimateSetPopulated {

        if (result == "OK") {
            return {
                type: EstimateTypes.ESTIMATE_SET_POPULATED,
                data: {setStatus: "complete", errors: []}
            }
        }
        else {
            result = result as Result;
            const setStatus = result.errors.map((e) => e.code).indexOf("missing-rows") > -1 ?
                "invalid" : "empty" as BurdenEstimateSetStatus;
            return {
                type: EstimateTypes.ESTIMATE_SET_POPULATED,
                data: {setStatus: setStatus, errors: result.errors}
            }
        }
    },

    getEstimates(outcome: BurdenOutcome, scenarioId: string, setId: number) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());

            const data = await (new EstimatesService(dispatch, getState))
                .getEstimates(ids.groupId, ids.touchstoneId, scenarioId, setId, outcome);

            return dispatch({
                type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
                data: {burdens: data, type: outcome, setId: setId}
            } as BurdenEstimatesFetched);
        }
    },
    resetPopulateState(): ResetPopulateState {
        return {
            type: EstimateTypes.RESET_POPULATE_STATE,
            data: true
        }
    },
    setChartType(outcome: BurdenOutcome) {
        return {
            type: EstimateTypes.SET_CHART_TYPE,
            data: outcome
        }
    }
};