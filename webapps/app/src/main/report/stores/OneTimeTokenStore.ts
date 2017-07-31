import { getFromLookup, ILookup } from "../../shared/models/Lookup";
import { alt } from "../../shared/alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { oneTimeTokenActions } from "../actions/OneTimeTokenActions";
import { OneTimeTokenSource } from "../sources/OneTimeTokenSource";
import { OneTimeToken } from "../models/OneTimeToken";
import StoreModel = AltJS.StoreModel;
import { ReportingFetcher } from "../sources/ReportingFetcher";

export interface OneTimeTokenStoreState {
    tokens: ILookup<OneTimeToken>;
    urlToFetchTokenFor: string;
}

export interface OneTimeTokenStoreInterface extends AltJS.AltStore<OneTimeTokenStoreState> {
    fetchToken(url: string): Promise<string>;
    _fetchToken(): Promise<string>;
    getToken(state: OneTimeTokenStoreState, url: string): OneTimeToken;
}

class OneTimeTokenStore extends AbstractStore<OneTimeTokenStoreState, OneTimeTokenStoreInterface> {
    tokens: ILookup<OneTimeToken>;
    // This is a bit of a hack. Essentially, the Alt.JS Source system only lets us fetch based on store state,
    // so we have this bit of state that we set just before invoking _fetchToken, so we can communicate which
    // token we want to fetch.
    urlToFetchTokenFor: string;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchToken: oneTimeTokenActions.beginFetchToken,
            handleReceiveToken: oneTimeTokenActions.receiveToken,
            handleClearUsedToken: oneTimeTokenActions.clearUsedToken
        });

        this.registerAsync(new OneTimeTokenSource());
        this.exportPublicMethods({
            getToken: this.getToken,
            fetchToken: (url: string) => {
                this.urlToFetchTokenFor = ReportingFetcher.buildRelativeReportingURL(url);
                return this.getInstance()._fetchToken();
            },
        });
    }

    getToken(state: OneTimeTokenStoreState, url: string): OneTimeToken {
        url = ReportingFetcher.buildRelativeReportingURL(url);
        return getFromLookup(state.tokens, url);
    }

    initialState(): OneTimeTokenStoreState {
        return {
            tokens: {},
            urlToFetchTokenFor: null
        };
    }

    handleBeginFetchToken() {
        const url = this.urlToFetchTokenFor;
        delete this.tokens[url];
    }

    handleReceiveToken(token: OneTimeToken){
        this.tokens[token.data.url] = token;
    }

    handleClearUsedToken(url: string) {
        url = ReportingFetcher.buildRelativeReportingURL(url);
        delete this.tokens[url];
    }
}

export const oneTimeTokenStore = alt.createStore<OneTimeTokenStoreState>(OneTimeTokenStore as StoreModel<OneTimeTokenStoreState>) as OneTimeTokenStoreInterface;