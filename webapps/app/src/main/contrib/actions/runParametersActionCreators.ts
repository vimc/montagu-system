import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {RunParametersService} from "../services/RunParametersService";
import {RunParametersSetsFetched, RunParametersTypes} from "../actionTypes/RunParametersTypes";

export const runParametersActionCreators = {

    getParameterSets(groupId: string, touchstoneId: string) {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const sets: any = await (new RunParametersService(dispatch, getState)).getParameterSets(groupId, touchstoneId);
            return dispatch({
                type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED,
                data: sets
            } as RunParametersSetsFetched );
        }
    },
};
