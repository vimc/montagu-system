import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {RunParametersService} from "../services/RunParametersService";
import {
    RunParametersSetsFetched, RunParametersTokenFetched,
    RunParametersTypes, RunParametersUploadStatus
} from "../actionTypes/RunParametersTypes";

export const runParametersActionCreators = {

    clearCacheForGetParameterSets(groupId: string, touchstoneId: string) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            (new RunParametersService(dispatch, getState)).clearCacheForGetParameterSets(groupId, touchstoneId);
        }
    },

    getParameterSets(groupId: string, touchstoneId: string) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            const sets: any = await (new RunParametersService(dispatch, getState)).getParameterSets(groupId, touchstoneId);
            console.log('get set in act', sets, groupId, touchstoneId)
            return dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED,
                data: sets
            } as RunParametersSetsFetched );
        }
    },

    getOneTimeToken(groupId: string, touchstoneId: string, setId: number) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
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
        return (dispatch: Dispatch<any>, getState: () => any) => {
            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;
            dispatch(runParametersActionCreators.clearCacheForGetParameterSets(group.id, touchstone.id))
            dispatch(runParametersActionCreators.getParameterSets(group.id, touchstone.id))
        }
    },

    uploadSet(data: FormData) {
        return async (dispatch: Dispatch<any>, getState: () => any) => {
            dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                data: {status: RunParametersUploadStatus.in_progress, errors: null}
            })
            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;
            const result: any = await (new RunParametersService(dispatch, getState)).uploadSet(group.id, touchstone.id, data);
            dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                data: {status: RunParametersUploadStatus.completed, errors: result.errors ? result.errors : null}
            })
            if (!result.errors) {
                dispatch(this.refreshParameterSets());
            }
        }
    },

    resetUploadStatus() {
        return (dispatch: Dispatch<any>) => {
            dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                data: {status: RunParametersUploadStatus.off, errors: null}
            })
        }
    }

};
