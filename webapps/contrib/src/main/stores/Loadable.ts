export interface Loadable<T> {
    content: { [index: string]: T };
    loaded: boolean;
}