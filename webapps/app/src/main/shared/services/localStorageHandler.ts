export const localStorageHandler = {
    get(property: string): any {
        if (typeof(Storage) === "undefined") {
            return null;
        }
        return localStorage.getItem(property);
    },
    set(property: string, value: any) : void {
        if (typeof(Storage) === "undefined") {
            return null;
        }
        localStorage.setItem(property, value);
    },
    remove(property: string): void {
        if (typeof(Storage) === "undefined") {
            return null;
        }
        localStorage.removeItem(property);
    }
};