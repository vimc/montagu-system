import { Dispatch } from "redux";

import {
    EstimatesCreateBurdenData,
    EstimatesOneTimeTokenClear, EstimatesOneTimeTokenFetched, EstimatesSetRedirectPath,
    EstimatesTypes
} from "../actionTypes/EstimatesTypes";
import {EstimatesService} from "../services/EstimatesService";
import {settings} from "../../shared/Settings";
import {responsibilitiesActionCreators} from "./responsibilitiesActionCreators";
import {mapStateToPropsHelper} from "../helpers/mapStateToPropsHelper";
import {ContribAppState} from "../reducers/contribAppReducers";
import {helpers} from "../../shared/Helpers";

export const estimatesActionCreators = {

    getOneTimeToken() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            dispatch({
                type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR,
            } as EstimatesOneTimeTokenClear );

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());

            const redirectPath = getState().estimates.redirectPath;
            const queryString = helpers.buildRedirectUrl(redirectPath);

            if (!ids.estimateSetId) {
                return dispatch({
                    type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED,
                    data: null
                } as EstimatesOneTimeTokenFetched );
            }

            const token: string = await (new EstimatesService(dispatch, getState))
                .getOneTimeToken(ids.groupId, ids.touchstoneId, ids.scenarioId, ids.estimateSetId, queryString);

            return dispatch({
                type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED,
                data: token
            } as EstimatesOneTimeTokenFetched );
        }
    },

    setRedirectPath(path: string) {
        return {
            type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH,
            data: path
        } as EstimatesSetRedirectPath;
    },

    createBurden(data: EstimatesCreateBurdenData) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const ids = mapStateToPropsHelper.getResponsibilityIds(getState());

            await (new EstimatesService(dispatch, getState)).createBurden(ids.groupId, ids.touchstoneId, ids.scenarioId, data);
            dispatch(responsibilitiesActionCreators.refreshResponsibilities());
        }
    }
};
