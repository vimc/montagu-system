export interface FormErrors {
    errors: any;
}

export function justState<T>(state: T & FormErrors): T {
    const copy = Object.assign({}, state);
    delete copy.errors;
    return copy;
}