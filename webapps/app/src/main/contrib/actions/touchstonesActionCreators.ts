import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {TouchstonesService} from "../services/TouchstonesService";
import {SetCurrentTouchstone, TouchstonesFetched, TouchstoneTypes} from "../actionTypes/TouchstonesTypes";
import {Touchstone} from "../../shared/models/Generated";

export const touchstonesActionCreators = {

    getTouchstonesByGroupId(groupId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const touchstones: Touchstone[] = await (new TouchstonesService(dispatch, getState)).getTouchstonesByGroupId(groupId);
            return dispatch({
                type: TouchstoneTypes.TOUCHSTONES_FETCHED,
                data: touchstones
            } as TouchstonesFetched );
        }
    },

    setCurrentTouchstone(touchstoneId: string) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const touchstones = getState().touchstones.touchstones;
            const currentTouchstone = touchstones.find(touchstone => touchstone.id === touchstoneId);
            dispatch({
                type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
                data: currentTouchstone
            } as SetCurrentTouchstone );
        }
    }
};
