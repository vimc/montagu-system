import {ReportingSource} from "./ReportingSource";
import {OnetimeTokenStoreState} from "../stores/OnetimeTokenStore";
import SourceModel = AltJS.SourceModel;
import {onetimeTokenActions} from "../actions/OnetimeTokenActions";

export class OnetimeTokenSource extends ReportingSource<OnetimeTokenStoreState> {
    _fetchToken: (url: string) => SourceModel<string>;

    constructor() {
        super();
        this._fetchToken = () => this.doFetch(s => "/onetime_token/?url=" + encodeURI(s.urlToFetchTokenFor), {
            loading: onetimeTokenActions.beginFetchToken,
            success: onetimeTokenActions.receiveToken,
            isCached: s => s.tokens && s.tokens.hasOwnProperty(s.urlToFetchTokenFor)
        });
    }
}
