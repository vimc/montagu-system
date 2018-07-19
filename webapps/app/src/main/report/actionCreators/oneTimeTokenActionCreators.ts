import {Dispatch} from "redux";
import {GlobalState} from "../../shared/reducers/GlobalState";
import {OneTimeTokenService} from "../services/OneTimeTokenService";
import {OneTimeTokenFetched, OnetimeTokenActionType} from "../actionTypes/OnetimeTokenActions";

export const oneTimeTokenActionCreators = {

    fetchToken(url: string) {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const token: string = await (new OneTimeTokenService(dispatch, getState)).fetchToken(url);
            dispatch({
                type: OnetimeTokenActionType.TOKEN_FETCHED,
                data: {url, token}
            } as OneTimeTokenFetched);
        }
    }
};
