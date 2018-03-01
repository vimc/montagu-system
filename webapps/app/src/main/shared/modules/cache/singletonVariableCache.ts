import { get, set } from 'lodash';
import {CacheInterface} from "./CacheInterface";

/**
 * lodash.get and lodash.set packages are used
 * https://lodash.com/docs/4.17.5#get and https://lodash.com/docs/4.17.5#set
 * Gets and sets the value at path of object
 * Implementation of cache in singleton class object property
 */

export class SingletonVariableCache implements CacheInterface {

    private data: any = {};

    get(key: string): any {
        return get(this.data, key);
    }

    set(key: string, value: any) : void {
        set(this.data, key, value);
    }

    clear(key: string) {
        this.set(key, undefined);
    }

    clearAll() {
        this.data = {};
    }
}

export const singletonVariableCache = new SingletonVariableCache();
