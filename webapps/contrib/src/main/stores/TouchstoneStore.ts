import alt from "../alt";
import * as AltJS from "alt";
import { RemoteContent } from "./RemoteContent";
import { AbstractStore } from "./AbstractStore";
import { touchstoneActions } from "../actions/TouchstoneActions";
import { Touchstone } from "../Models";
import { sources } from "../sources/Sources";

export interface State extends RemoteContent {
    touchstones: Array<Touchstone>;
}

interface TouchstoneStoreInterface extends AltJS.AltStore<State> {
    fetchTouchstones(): Promise<any>;
    isLoading(): boolean;
}

class TouchstoneStore extends AbstractStore<State, TouchstoneStoreInterface> {
    touchstones: Array<Touchstone>;
    ready: boolean;

    constructor() {
        super();
        this.registerAsync(sources.touchstones);
        this.bindListeners({
            handleBeginFetch: touchstoneActions.beginFetch,
            handleUpdate: touchstoneActions.update
        });
    }

    initialState(): State {
        return {
            touchstones: [],
            ready: false
        };
    }

    handleBeginFetch() {
        this.touchstones = [];
        this.ready = false;
    }

    handleUpdate(touchstones: Array<Touchstone>) {
        this.touchstones = touchstones;
        this.ready = true;
    }
}

export const Store = alt.createStore<State>(TouchstoneStore) as TouchstoneStoreInterface;