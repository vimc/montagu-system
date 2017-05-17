export abstract class AbstractStore<State, Interface extends AltJS.AltStore<State>> implements AltJS.StoreModel<State> {
    bindListeners: (obj: any) => void;
    exportPublicMethods: (config: { [key: string]: (...args: Array<any>) => any }) => any;
    exportAsync: (source: any) => void;
    waitFor: any;
    exportConfig: any;
    getState: () => State;
    registerAsync: (datasource: any) => void;
    getInstance: () => Interface;

    abstract initialState(): State;

    constructor() {
        this.resetState();
    }

    resetState() {
        Object.assign(this, this.initialState());
    }
}