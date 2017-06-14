import { expect } from "chai";

import { emptyLookup, getFromLookup, makeLookup } from "../../../main/contrib/stores/Loadable";
import { mockDisease } from "../../mocks/mockModels";
import { Disease } from "../../../main/contrib/models/Generated";

describe("Loadable", () => {
    it("can make lookup from array", () => {
        const diseases = [ mockDisease({ id: "d0" }), mockDisease({ id: "d1" }) ];
        const x = makeLookup(diseases);
        expect(x).to.eql({
            content: {
                d0: diseases[0],
                d1: diseases[1]
            },
            loaded: true
        });
    });

    it("getFromLookup returns null if lookup is unloaded", () => {
        const x = emptyLookup<Disease>();
        expect(getFromLookup(x, "d0")).to.be.null;
    });

    it("getFromLookup returns null if key doesn't exist", () => {
        const x = makeLookup([ mockDisease({ id: "d0" }) ]);
        expect(getFromLookup(x, "d1")).to.be.null;
    });

    it("getFromLookup returns object with matching key", () => {
        const disease = mockDisease({ id: "d0" });
        const x = makeLookup([ disease ]);
        expect(getFromLookup(x, "d0")).to.equal(disease);
    });
});
