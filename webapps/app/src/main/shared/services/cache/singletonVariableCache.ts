import { get, set } from 'lodash';
import {CacheInterface} from "./CacheInterface";

/**
 * Implementation of cache in variable
 */

export const singletonVariableCache = {

    data: {},

    get(key: string): any {
        return get(this.data, key);
    },

    set(key: string, value: any) : void {
        set(this.data, key, value);
    },

    clear(key: string) {
        this.set(key, null);
    },

    clearAll() {
        this.data = {};
    }
} as CacheInterface;