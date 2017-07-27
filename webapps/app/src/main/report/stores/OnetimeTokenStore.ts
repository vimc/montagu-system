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
        console.log("Beginning to get token for " + url);
        delete this.tokens[url];
    }

    handleReceiveToken(token: OnetimeToken){
        this.tokens[token.data.url] = token;
        console.log("Got onetime token for " + token.data.url);
    }
}

export const onetimeTokenStore = alt.createStore<OnetimeTokenStoreState>(OnetimeTokenStore as StoreModel<OnetimeTokenStoreState>) as OnetimeTokenStoreInterface;