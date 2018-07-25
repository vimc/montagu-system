import {Dispatch} from "redux";
import {GlobalState} from "../reducers/GlobalState";
import {OneTimeTokenService} from "../services/OneTimeTokenService";
import {OneTimeTokenFetched, OnetimeTokenActionType} from "../actionTypes/OnetimeTokenActions";
import {APIService} from "../models/APIService";

export const oneTimeTokenActionCreators = {

    fetchToken(url: string, service: APIService) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const token: string = await (new OneTimeTokenService(dispatch, getState)).fetchToken(url, service);
            dispatch({
                type: OnetimeTokenActionType.TOKEN_FETCHED,
                data: {url, token}
            } as OneTimeTokenFetched);
        }
    }
};
