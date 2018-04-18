import {Dispatch} from "redux";

import {GlobalState} from "../../shared/reducers/GlobalState";
import {UserService} from "../services/UserService";
import {ConfidentialityRetrieved, ConfidentialitySigned, UserActionType} from "../actionTypes/UserActionTypes";

export const userActionCreators = {

    signConfidentialityAgreement() {

        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result: any = await (new UserService(dispatch, getState)).signConfidentiality();

            if (result == "OK") {
                dispatch({
                    type: UserActionType.CONFIDENTIALITY_SIGNED,
                    data: true
                } as ConfidentialitySigned);
            }
        }
    },

    getConfidentialityAgreement() {

        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const result: Boolean = await (new UserService(dispatch, getState)).getConfidentiality();

            dispatch({
                type: UserActionType.CONFIDENTIALITY_RETRIEVED,
                data: result
            } as ConfidentialityRetrieved);
        }
    }
};
