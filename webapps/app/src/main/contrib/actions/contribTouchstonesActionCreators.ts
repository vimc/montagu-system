import {Dispatch} from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {TouchstonesService} from "../../shared/services/TouchstonesService";
import {SetCurrentTouchstoneVersion, TouchstonesFetchedForGroup, TouchstoneTypes} from "../../shared/actionTypes/TouchstonesTypes";
import {Touchstone} from "../../shared/models/Generated";
import {flatMap} from "../../shared/ArrayHelpers";

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

    setCurrentTouchstoneVersion(touchstoneVersionId: string) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const touchstones = getState().touchstones.touchstones;
            const versions = flatMap(touchstones, x => x.versions);
            const currentTouchstoneVersion = versions.find(v => v.id === touchstoneVersionId);
            dispatch({
                type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE_VERSION,
                data: currentTouchstoneVersion
            } as SetCurrentTouchstoneVersion );
        }
    }
};
