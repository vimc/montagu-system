export const isNonEmptyArray = (arrayData: any[]) => {
    return Array.isArray(arrayData) && arrayData.length;
};

export function flatten<T>(arrayOfArrays: Array<Array<T>>): T[] {
    if (isNonEmptyArray(arrayOfArrays)) {
        return arrayOfArrays.reduce((a, b) => concatArrays(a, b));
    } else {
        return [];
    }
}

export function concatArrays<T>(a: Array<T>, b: Array<T>) {
    a = a || [];
    b = b || [];
    return a.concat(b);
}

export function flatMap<TModel, TResult>(array: TModel[], f: (x: TModel) => TResult[]): TResult[] {
    return flatten(array.map(f));
}
