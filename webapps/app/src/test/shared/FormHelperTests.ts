import { expect } from "chai";
import { justState } from "../../main/shared/FormHelpers";

describe("FormHelpers", () => {
    it("can get just the state from state+errors", () => {
        const state = {
            foo: "bar",
            errors: true
        };
        expect(justState(state)).to.eql({
            foo: "bar"
        })
    });
});