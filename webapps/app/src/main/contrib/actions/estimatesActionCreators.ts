import { Dispatch } from "redux";

import {
    EstimatesCreateBurdenData,
    EstimatesOneTimeTokenClear, EstimatesOneTimeTokenFetched, EstimatesSetRedirectPath,
    EstimatesTypes
} from "../actionTypes/EstimatesTypes";
import {EstimatesService} from "../services/EstimatesService";
import {settings} from "../../shared/Settings";
import {responsibilitiesActionCreators} from "./responsibilitiesActionCreators";

export const estimatesActionCreators = {

    getOneTimeToken() {
        return async (dispatch: Dispatch<any>, getState: any) => {
            dispatch({
                type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_CLEAR,
            } as EstimatesOneTimeTokenClear );

            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;
            const responsibility = getState().responsibilities.currentResponsibility;
            const redirectPath = getState().estimates.redirectPath;
            const queryString = "?redirectUrl=" + encodeURI(settings.montaguUrl() + '/' + redirectPath);

            if (!responsibility.current_estimate_set) return null;

            const token: string = await (new EstimatesService(dispatch, getState))
                .getOneTimeToken(group.id, touchstone.id, responsibility.scenario.id, responsibility.current_estimate_set.id, queryString);

            return dispatch({
                type: EstimatesTypes.ESTIMATES_ONE_TIME_TOKEN_FETCHED,
                data: token
            } as EstimatesOneTimeTokenFetched );
        }
    },

    setRedirectPath(path: string) {
        return async (dispatch: Dispatch<any>) => {
            return dispatch({
                type: EstimatesTypes.ESTIMATES_SET_REDIRECT_PATH,
                data: path
            } as EstimatesSetRedirectPath );
        }
    },

    createBurden(data: EstimatesCreateBurdenData) {
        return async (dispatch: Dispatch<any>, getState: any) => {
            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;
            const responsibility = getState().responsibilities.currentResponsibility;
            await (new EstimatesService(dispatch, getState)).createBurden(group.id, touchstone.id, responsibility.scenario.id, data);
            dispatch(responsibilitiesActionCreators.refreshResponsibilities());
        }
    }
};
