import { localStorageHandler } from "./localStorageHandler";
import { get, set } from 'lodash';

export const localCache = {

    cacheKey: "cache",

    getCache() {
      return  JSON.parse(localStorageHandler.get(this.cacheKey)) || {};
    },

    saveCache(cache: any) {
        localStorageHandler.set(this.cacheKey, JSON.stringify(cache));
    },

    set(key: string, value: any) {
        const cacheObj = this.getCache();
        set(cacheObj, key, value);
        this.saveCache(cacheObj);
    },

    get(key: string) {
        return get(this.getCache(), key);
    },

    clear(key: string) {
        this.set(key, null);
    }
};