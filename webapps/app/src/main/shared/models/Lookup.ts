import {HasId} from "../../contrib/models/HasId";

export type ILookup<T> = { [index: string]: T };

export function getFromLookup<T>(lookup: ILookup<T>, index: string): T {
    if (lookup.hasOwnProperty(index)) {
        return lookup[index];
    } else {
        return null;
    }
}

export function makeLookup<T extends HasId>(items: T[]): ILookup<T> {
    const lookup: ILookup<T> = {};
    items.forEach(item => {
        lookup[item.id] = item;
    });
    return lookup;
}