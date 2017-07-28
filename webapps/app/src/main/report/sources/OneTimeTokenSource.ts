import {ReportingSource} from "./ReportingSource";
import {OneTimeTokenStoreState} from "../stores/OneTimeTokenStore";
import SourceModel = AltJS.SourceModel;
import {oneTimeTokenActions} from "../actions/OneTimeTokenActions";

export class OneTimeTokenSource extends ReportingSource<OneTimeTokenStoreState> {
    _fetchToken: (url: string) => SourceModel<string>;

    constructor() {
        super();
        this._fetchToken = () => this.doFetch(s => "/onetime_token/?url=" + encodeURI(s.urlToFetchTokenFor), {
            loading: oneTimeTokenActions.beginFetchToken,
            success: oneTimeTokenActions.receiveToken,
            isCached: s => s.tokens && s.tokens.hasOwnProperty(s.urlToFetchTokenFor)
        });
    }
}
