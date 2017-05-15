import { AbstractActions } from "./AbstractActions";
import { Result } from "../Models";

export interface FetchActionsInterface<T> {
    update(data: T): T;
    beginFetch(): boolean;
}

export class FetchActions<T> extends AbstractActions implements FetchActionsInterface<T> {
    update(data: T) {
        return data;
    }
    beginFetch(): boolean {
        return true;
    }
}