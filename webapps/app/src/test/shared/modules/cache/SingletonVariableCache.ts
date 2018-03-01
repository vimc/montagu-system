import { expect } from "chai";
import { SingletonVariableCache } from "../../../../main/shared/modules/cache/singletonVariableCache";

describe('Singleton variable cache tests', () => {

    const key = "test.test1.test2";

    it('sets data to a prop with path and gets data by same path', () => {
        const cache = new SingletonVariableCache();
        expect(cache.get(key)).to.equal(undefined);
        cache.set(key, "testData");
        expect(cache.get(key)).to.equal("testData");
    });

    it('sets data to a prop by path and gets data of parent prop', () => {
        const cache = new SingletonVariableCache();
        cache.set(key, "testData");
        expect(cache.get("test.test1")).to.have.key("test2");
        expect(cache.get("test.test1").test2).to.equal("testData");
    });

    it('sets data to a prop by path and clears by same path', () => {
        const cache = new SingletonVariableCache();
        cache.set(key, "testData");
        expect(cache.get(key)).to.equal("testData");
        cache.clear(key);
        expect(cache.get(key)).to.equal(undefined);
    });

    it('sets data to a prop by path and clears by parent segment from path', () => {
        const cache = new SingletonVariableCache();
        cache.set(key, "testData");
        expect(cache.get(key)).to.equal("testData");
        cache.clear("test.test1");
        expect(cache.get(key)).to.equal(undefined);
    });

    it('sets data to a prop by path and clears all', () => {
        const cache = new SingletonVariableCache();
        cache.set(key, "testData");
        expect(cache.get(key)).to.equal("testData");
        cache.clearAll();
        expect(cache.get(key)).to.equal(undefined);
    });

});