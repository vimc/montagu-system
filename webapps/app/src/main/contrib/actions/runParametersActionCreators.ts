import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {RunParametersService} from "../services/RunParametersService";
import {
    RunParametersSetsFetched, RunParametersSetUploadStatus, RunParametersTokenFetched,
    RunParametersTypes, RunParametersUploadStatus, RunParametersUploadStatusData
} from "../actionTypes/RunParametersTypes";
import {ModelRunParameterSet, Result} from "../../shared/models/Generated";

export const runParametersActionCreators = {

    clearCacheForGetParameterSets(groupId: string, touchstoneId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            (new RunParametersService(dispatch, getState)).clearCacheForGetParameterSets(groupId, touchstoneId);
        }
    },

    getParameterSets(groupId: string, touchstoneId: string) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const sets: ModelRunParameterSet[] = await (new RunParametersService(dispatch, getState))
                .getParameterSets(groupId, touchstoneId);
            return dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED,
                data: sets
            } as RunParametersSetsFetched );
        }
    },

    getOneTimeToken(groupId: string, touchstoneId: string, setId: number) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const token: string = await (new RunParametersService(dispatch, getState)).getOneTimeToken(groupId, touchstoneId, setId);
            return dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED,
                data: {
                    id: setId,
                    token
                }
            } as RunParametersTokenFetched);
        }
    },

    refreshParameterSets() {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;

            dispatch(this.clearCacheForGetParameterSets(group.id, touchstone.id))
            dispatch(this.getParameterSets(group.id, touchstone.id))
        }
    },

    uploadSet(data: FormData) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                data: {status: RunParametersUploadStatus.in_progress, errors: null}
            })

            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;

            const result: Result = await (new RunParametersService(dispatch, getState))
                .uploadSet(group.id, touchstone.id, data);

            dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                data: {status: RunParametersUploadStatus.completed, errors: result && result.errors ? result.errors : null}
            })
            if (result && !result.errors) {
                dispatch(this.refreshParameterSets());
            }
        }
    },

    resetUploadStatus() {
        return {
            type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
            data: {status: RunParametersUploadStatus.off, errors: null}
        } as RunParametersSetUploadStatus;
    }

};
