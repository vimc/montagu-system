import { getFromLookup, ILookup } from "../../shared/models/Lookup";
import { alt } from "../../shared/alt";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { onetimeTokenActions } from "../actions/OnetimeTokenActions";
import { OnetimeTokenSource } from "../sources/OnetimeTokenSource";
import { OnetimeToken } from "../models/OnetimeToken";
import StoreModel = AltJS.StoreModel;
import { ReportingFetcher } from "../sources/ReportingFetcher";

export interface OnetimeTokenStoreState {
    tokens: ILookup<OnetimeToken>;
    urlToFetchTokenFor: string;
}

export interface OnetimeTokenStoreInterface extends AltJS.AltStore<OnetimeTokenStoreState> {
    fetchToken(url: string): Promise<string>;
    _fetchToken(): Promise<string>;
    getToken(state: OnetimeTokenStoreState, url: string): OnetimeToken;
}

class OnetimeTokenStore extends AbstractStore<OnetimeTokenStoreState, OnetimeTokenStoreInterface> {
    tokens: ILookup<OnetimeToken>;
    // This is a bit of a hack. Essentially, the Alt.JS Source system only lets us fetch based on store state,
    // so we have this bit of state that we set just before invoking _fetchToken, so we can communicate which
    // token we want to fetch.
    urlToFetchTokenFor: string;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchToken: onetimeTokenActions.beginFetchToken,
            handleReceiveToken: onetimeTokenActions.receiveToken
        });

        this.registerAsync(new OnetimeTokenSource());
        this.exportPublicMethods({
            getToken: this.getToken,
            fetchToken: (url: string) => {
                this.urlToFetchTokenFor = ReportingFetcher.buildRelativeReportingURL(url);
                return this.getInstance()._fetchToken();
            }
        });
    }

    getToken(state: OnetimeTokenStoreState, url: string): OnetimeToken {
        url = ReportingFetcher.buildRelativeReportingURL(url);
        console.log("DEBUG: Looking for " + url);
        console.log("DEBUG: Lookup " + JSON.stringify(state.tokens));
        return getFromLookup(state.tokens, url);
    }

    initialState(): OnetimeTokenStoreState {
        return {
            tokens: {},
            urlToFetchTokenFor: null
        };
    }

    handleBeginFetchToken() {
        const url = this.urlToFetchTokenFor;
        delete this.tokens[url];
    }

    handleReceiveToken(token: OnetimeToken){
        this.tokens[token.data.url] = token;
        console.log("DEBUG: After receive: " + JSON.stringify(this.tokens));
    }
}

export const onetimeTokenStore = alt.createStore<OnetimeTokenStoreState>(OnetimeTokenStore as StoreModel<OnetimeTokenStoreState>) as OnetimeTokenStoreInterface;