import {Dispatch} from "redux";
import {ResponsibilitySet, Touchstone} from "../../shared/models/Generated";
import {AdminAppState} from "../reducers/adminAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {
    AllTouchstonesFetched, ResponsibilitiesForTouchstoneVersionFetched,
    TouchstoneTypes
} from "../../shared/actionTypes/TouchstonesTypes";

export const adminTouchstoneActionCreators = {
    getAllTouchstones() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const touchstones: Touchstone[] = await (new TouchstonesService(dispatch, getState)).getAllTouchstones();
            dispatch({
                type: TouchstoneTypes.ALL_TOUCHSTONES_FETCHED,
                data: touchstones
            } as AllTouchstonesFetched);
        }
    },

    getResponsibilitiesForTouchstoneVersion(touchstoneVersion: string){
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const responsibilitySets: ResponsibilitySet[] = await (new TouchstonesService(dispatch, getState))
                .getResponsibilitiesForTouchstoneVersion(touchstoneVersion);
            dispatch({
                type: TouchstoneTypes.RESPONSIBILITIES_FOR_TOUCHSTONE_VERSION_FETCHED,
                data: responsibilitySets
            } as ResponsibilitiesForTouchstoneVersionFetched);
        }
    }
};