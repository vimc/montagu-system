import {ReportingSource} from "./ReportingSource";
import {OnetimeTokenStoreState} from "../stores/OnetimeTokenStore";
import SourceModel = AltJS.SourceModel;
import {onetimeTokenActions} from "../actions/OnetimeTokenActions";

export class OnetimeTokenSource extends ReportingSource<OnetimeTokenStoreState> {

    fetchToken: (url: string) => SourceModel<string>;

    constructor() {
        super();
        this.fetchToken = (url: string) => this.doFetch(() => "/onetime_token/?url=" + encodeURI(url), {
            loading: onetimeTokenActions.beginFetchToken,
            success: (token: string) => onetimeTokenActions.updateToken(token, url),
            isCached: s => s.tokens && s.tokens.hasOwnProperty(url)
        });
    }
}
