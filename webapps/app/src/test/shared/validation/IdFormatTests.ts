import {expect} from "chai";
import {validations} from "../../../main/shared/modules/reduxForm";

describe("IdFormatTests", () => {

    const errorMessage = " must be in the format 'something-something'.";

    it("accepts word", () => {
        expect(validations.id("word")).to.be.undefined;
    });
    it("accepts uppercase", () => {
        expect(validations.id("Word")).to.be.undefined;
    });
    it("accepts numbers", () => {
        expect(validations.id("word123")).to.be.undefined;
    });
    it("accepts words with - separators", () => {
        expect(validations.id("a-b-c")).to.be.undefined;
    });
    it("rejects underscores", () => {
        expect(validations.id("a_b")).to.eq(errorMessage);
    });
    it("rejects periods", () => {
        expect(validations.id("a.b")).to.eq(errorMessage);
    });
    it("rejects weird chars", () => {
        expect(validations.id("a%b")).to.eq(errorMessage);
        expect(validations.id("a$b")).to.eq(errorMessage);
    });
});
