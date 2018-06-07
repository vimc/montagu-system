import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {SetCurrentTouchstone, TouchstonesFetchedForGroup, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";
import {Touchstone} from "../../shared/models/Generated";

export const contribTouchstonesActionCreators = {

    getTouchstonesByGroupId(groupId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const touchstones: Touchstone[] = await (new TouchstonesService(dispatch, getState)).getTouchstonesByGroupId(groupId);
            return dispatch({
                type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP,
                data: touchstones
            } as TouchstonesFetchedForGroup );
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
