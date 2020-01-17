
import {validations} from "../../../main/shared/modules/reduxForm";

describe("IdFormatTests", () => {

    const errorMessage = " must be in the format 'something-something'.";

    it("accepts word", () => {
        expect(validations.id("word")).toBeUndefined();
    });
    it("accepts uppercase", () => {
        expect(validations.id("Word")).toBeUndefined();
    });
    it("accepts numbers", () => {
        expect(validations.id("word123")).toBeUndefined();
    });
    it("accepts words with - separators", () => {
        expect(validations.id("a-b-c")).toBeUndefined();
    });
    it("rejects underscores", () => {
        expect(validations.id("a_b")).toEqual(errorMessage);
    });
    it("rejects periods", () => {
        expect(validations.id("a.b")).toEqual(errorMessage);
    });
    it("rejects weird chars", () => {
        expect(validations.id("a%b")).toEqual(errorMessage);
        expect(validations.id("a$b")).toEqual(errorMessage);
    });
});
