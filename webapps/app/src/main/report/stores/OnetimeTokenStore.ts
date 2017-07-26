import {RemoteContent} from "../../shared/models/RemoteContent";
import {ILookup} from "../../shared/models/Lookup";
import StoreModel = AltJS.StoreModel;
import {alt} from "../../shared/alt";
import {AbstractStore} from "../../shared/stores/AbstractStore";
import {onetimeTokenActions} from "../actions/OnetimeTokenActions";
import {OnetimeTokenSource} from "../sources/OnetimeTokenSource";

export interface OnetimeTokenStoreState extends RemoteContent {
    tokens: ILookup<string>;
}

export interface OnetimeTokenStoreInterface extends AltJS.AltStore<OnetimeTokenStoreState> {
    fetchToken(url: string): Promise<string>;
}

class OnetimeTokenStore
    extends AbstractStore<OnetimeTokenStoreState, OnetimeTokenStoreInterface> {
    tokens: ILookup<string>;
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchToken: onetimeTokenActions.beginFetchToken,
            handleUpdateToken: onetimeTokenActions.updateToken
        });

        this.registerAsync(new OnetimeTokenSource())
    }

    initialState(): OnetimeTokenStoreState {
        return {
            ready: false,
            tokens: {}
        };
    }

    handleBeginFetchToken(url: string){
        this.ready = false;
        delete this.tokens[url];
    }

    handleUpdateToken(tokenLookup: any){
        this.tokens[tokenLookup["url"]] = tokenLookup["token"];
        this.ready = true;
    }


}

export const onetimeTokenStore = alt.createStore<OnetimeTokenStoreState>(OnetimeTokenStore as StoreModel<OnetimeTokenStoreState>) as OnetimeTokenStoreInterface;