import {Dispatch} from "redux";
import {Touchstone} from "../../shared/models/Generated";
import {AdminAppState} from "../reducers/adminAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {AllTouchstonesFetched, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";

export const adminTouchstoneActionCreators = {
    getAllTouchstones() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const touchstones: Touchstone[] = await (new TouchstonesService(dispatch, getState)).getAllTouchstones();
            dispatch({
                type: TouchstoneTypes.ALL_TOUCHSTONES_FETCHED,
                data: touchstones
            } as AllTouchstonesFetched);
        }
    }
};