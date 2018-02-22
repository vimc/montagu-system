import { expect } from "chai";
import { singletonVariableCache } from "../../../../main/shared/services/cache/singletonVariableCache";

describe('Singleton variable cache tests', () => {

    it('sets and gets data', () => {
        const key = "test.test1.test2";
        singletonVariableCache.clearAll();
        expect(singletonVariableCache.get(key)).to.equal(undefined);
        singletonVariableCache.set(key, "testData");
        expect(singletonVariableCache.get(key)).to.equal("testData");
        expect(singletonVariableCache.get("test.test1")).to.have.key("test2");
        expect(singletonVariableCache.get("test.test1").test2).to.equal("testData");
        singletonVariableCache.clear(key);
        expect(singletonVariableCache.get(key)).to.equal(undefined);
        expect(singletonVariableCache.get("test.test1")).to.have.key("test2");
        singletonVariableCache.clearAll();
    });

});