import {SingletonVariableCache} from "../../../../main/shared/modules/cache/singletonVariableCache";

describe('Singleton variable cache tests', () => {

    const key = "test.test1.test2";

    it('sets data to a prop with path and gets data by same path', () => {
        const cache = new SingletonVariableCache();
        expect(cache.get(key)).toEqual(undefined);
        cache.set(key, "testData");
        expect(cache.get(key)).toEqual("testData");
    });

    it('sets data to a prop by path and gets data of parent prop', () => {
        const cache = new SingletonVariableCache();
        cache.set(key, "testData");
        expect(cache.get("test.test1")["test2"]).toBeDefined();
        expect(cache.get("test.test1").test2).toEqual("testData");
    });

    it('sets data to a prop by path and clears by same path', () => {
        const cache = new SingletonVariableCache();
        cache.set(key, "testData");
        expect(cache.get(key)).toEqual("testData");
        cache.clear(key);
        expect(cache.get(key)).toEqual(undefined);
    });

    it('sets data to a prop by path and clears by parent segment from path',
        () => {
            const cache = new SingletonVariableCache();
            cache.set(key, "testData");
            expect(cache.get(key)).toEqual("testData");
            cache.clear("test.test1");
            expect(cache.get(key)).toEqual(undefined);
        }
    );

    it('sets data to a prop by path and clears all', () => {
        const cache = new SingletonVariableCache();
        cache.set(key, "testData");
        expect(cache.get(key)).toEqual("testData");
        cache.clearAll();
        expect(cache.get(key)).toEqual(undefined);
    });

});