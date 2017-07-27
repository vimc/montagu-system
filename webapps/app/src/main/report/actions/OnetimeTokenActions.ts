import { alt } from "../../shared/alt";
import { FetchActions } from "../../shared/actions/FetchActions";
import { decodeOnetimeToken, OnetimeToken } from "../models/OnetimeToken";

interface Actions {
    beginFetchToken(): boolean;
    receiveToken(token: string): OnetimeToken;
}

class OnetimeTokenActions extends FetchActions<string[]> implements Actions {
    beginFetchToken(): boolean {
        return true;
    }

    receiveToken(token: string): OnetimeToken {
        return {
            raw: token,
            data: decodeOnetimeToken(token)
        };
    }
}

export const onetimeTokenActions =
    alt.createActions<Actions>(OnetimeTokenActions);
