import {Dispatch} from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {SetCurrentTouchstoneVersion, TouchstonesFetchedForGroup, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";
import {Touchstone} from "../../shared/models/Generated";
import {flatMap} from "../../shared/ArrayHelpers";
import {touchstonesActionCreators} from "../../shared/actions/touchstoneActionCreators";

export const contribTouchstonesActionCreators = {

    getTouchstonesByGroupId(groupId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const touchstones: Touchstone[] = await (new TouchstonesService(dispatch, getState))
                .getTouchstonesByGroupId(groupId);
            return dispatch({
                type: TouchstoneTypes.TOUCHSTONES_FETCHED_FOR_GROUP,
                data: touchstones
            } as TouchstonesFetchedForGroup );
        }
    },

    setCurrentTouchstoneVersion(touchstoneVersionId: string) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const touchstones = getState().touchstones.touchstones;
            dispatch(touchstonesActionCreators.setCurrentTouchstoneVersion(touchstoneVersionId, touchstones));
        }
    }
};
