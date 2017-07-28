import { alt } from "../main/shared/alt";
import AltStore = AltJS.AltStore;

export function bootstrapStore<TState, TInterface extends AltStore<TState>>(store: TInterface, state: TState) {
    const data: any = {};
    const name = (store as any).displayName;
    data[name] = state;
    alt.bootstrap(JSON.stringify(data));
}