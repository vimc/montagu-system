import {HasId} from "../../contrib/models/HasId";

export type ILookup<T> = { [index: string]: T };

export function makeLookup<T extends HasId>(items: T[]): ILookup<T> {
    const lookup: ILookup<T> = {};
    items.forEach(item => {
        lookup[item.id] = item;
    });
    return lookup;
}