import {ReportingSource} from "./ReportingSource";
import {OneTimeTokenStoreState} from "../stores/OneTimeTokenStore";
import SourceModel = AltJS.SourceModel;
import {oneTimeTokenActions} from "../actions/OneTimeTokenActions";
import {ILookup} from "../../shared/models/Lookup";
import {OneTimeToken} from "../models/OneTimeToken";

export class OneTimeTokenSource extends ReportingSource<OneTimeTokenStoreState> {
    _fetchToken: () => SourceModel<string>;

    constructor() {
        super();
        this._fetchToken = () => this.doFetch(s => "/onetime_token/?url=" + encodeURI(s.urlToFetchTokenFor), {
            loading: oneTimeTokenActions.beginFetchToken,
            success: oneTimeTokenActions.receiveToken,
            isCached: s => s.tokens && s.tokens.hasOwnProperty(s.urlToFetchTokenFor)
        });
    }
}
