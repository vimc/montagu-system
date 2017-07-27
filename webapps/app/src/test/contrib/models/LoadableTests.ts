import { expect } from "chai";

import { emptyLoadable, getFromLoadable, makeLoadable } from "../../../main/contrib/stores/Loadable";
import { mockDisease } from "../../mocks/mockModels";
import { Disease } from "../../../main/shared/models/Generated";

describe("Loadable", () => {
    it("can make lookup from array", () => {
        const diseases = [ mockDisease({ id: "d0" }), mockDisease({ id: "d1" }) ];
        const x = makeLoadable(diseases);
        expect(x).to.eql({
            content: {
                d0: diseases[0],
                d1: diseases[1]
            },
            loaded: true
        });
    });

    it("getFromLoadable returns null if lookup is unloaded", () => {
        const x = emptyLoadable<Disease>();
        expect(getFromLoadable(x, "d0")).to.be.null;
    });

    it("getFromLoadable returns null if key doesn't exist", () => {
        const x = makeLoadable([ mockDisease({ id: "d0" }) ]);
        expect(getFromLoadable(x, "d1")).to.be.null;
    });

    it("getFromLoadable returns object with matching key", () => {
        const disease = mockDisease({ id: "d0" });
        const x = makeLoadable([ disease ]);
        expect(getFromLoadable(x, "d0")).to.equal(disease);
    });
});
