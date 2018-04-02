import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {TouchstonesService} from "../services/TouchstonesService";
import {SetCurrentTouchstone, TouchstonesFetched, TouchstoneTypes} from "../actionTypes/TouchstonesTypes";

export const touchstonesActionCreators = {

    getTouchstonesByGroupId(groupId: string) {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const touchstones: any = await (new TouchstonesService(dispatch, getState)).getTouchstonesByGroupId(groupId);
            return dispatch({
                type: TouchstoneTypes.TOUCHSTONES_FETCHED,
                data: touchstones
            } as TouchstonesFetched );
        }
    },

    setCurrentTouchstone(touchstoneId: string) {
        return (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const touchstones = getState().touchstones.touchstones;
            const currentTouchstone = touchstones.find(touchstone => touchstone.id === touchstoneId);
            dispatch({
                type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE,
                data: currentTouchstone
            } as SetCurrentTouchstone );
        }
    }
};
