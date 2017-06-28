export type ILookup<T> = { [index: string]: T };

export class Dict<T> {
    lookup: ILookup<T>;

    constructor(lookup: ILookup<T>) {
        if (lookup != null) {
            this.lookup = lookup;
        } else {
            this.lookup = {};
        }
    }

    get(key: string) {
        if (this.lookup.hasOwnProperty(key)) {
            return this.lookup[key];
        } else {
            return null;
        }
    }
    remove(key: string) {
        if (this.lookup.hasOwnProperty(key)) {
            delete this.lookup[key];
        }
    }
}
