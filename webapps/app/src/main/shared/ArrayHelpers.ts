export const isNonEmptyArray = (arrayData: any[]) => {
    return Array.isArray(arrayData) && arrayData.length;
};
export const isNullOrEmptyArray = (arrayData: any[]) => {
    return !Array.isArray(arrayData) || !arrayData.length;
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

interface Grouping<TKey, TValue> {
    key: TKey,
    values: TValue[]
}

export function groupBy<TItem>(
    items: TItem[],
    groupingFunction: (item: TItem) => string
): Grouping<string, TItem>[] {
    const result: { [index: string]: Grouping<string, TItem> } = {};
    items.forEach(item => {
        const key = groupingFunction(item);
        if (!result[key]) {
            result[key] = {key, values: []};
        }
        result[key].values.push(item);
    });
    return Object.keys(result).map(x => result[x]);
}
