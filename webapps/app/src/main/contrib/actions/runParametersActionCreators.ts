import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {RunParametersService} from "../services/RunParametersService";
import {
    RunParametersSetsFetched, RunParametersTokenFetched,
    RunParametersTypes
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
    }
};
