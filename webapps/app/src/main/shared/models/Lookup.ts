export type ILookup<T> = { [index: string]: T };

export function getFromLookup<T>(lookup: ILookup<T>, index: string): T {
    if (lookup.hasOwnProperty(index)) {
        return lookup[index];
    } else {
        return null;
    }
}
