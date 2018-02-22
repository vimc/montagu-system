export interface CacheInterface {
    get: (key: string) => any;
    set: (key: string, value: any) => any;
    clear: (key: string) => void;
    clearAll: () => void;
}