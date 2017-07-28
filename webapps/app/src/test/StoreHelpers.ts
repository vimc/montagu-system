import { alt } from "../main/shared/alt";
import AltStore = AltJS.AltStore;
import { OneTimeToken } from "../main/report/models/OneTimeToken";
import { oneTimeTokenStore } from "../main/report/stores/OneTimeTokenStore";

export function bootstrapStore<TState, TInterface extends AltStore<TState>>(store: TInterface, state: TState) {
    const data: any = {};
    const name = (store as any).displayName;
    data[name] = state;
    alt.bootstrap(JSON.stringify(data));
}

export function bootstrapOneTimeTokenStore(tokens: OneTimeToken[], urlToFetchTokenFor?: string) {
    const lookup: any = {};
    tokens.forEach(t => lookup[t.data.url] = t);
    return bootstrapStore(oneTimeTokenStore, {
        tokens: lookup,
        urlToFetchTokenFor: urlToFetchTokenFor
    });
}