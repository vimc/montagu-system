
export interface CacheInterface {
    get(key: string): any;
    set(key: string, value: any) : void;
    clear(key: string) : void;
    clearAll (): void;
}
