import {expect} from "chai";
import {validations} from "../../../main/shared/modules/reduxForm";

describe("IdFormatTests", () => {

    const errorMessage = " must be in the format 'something-something'.";

    test("accepts word", () => {
        expect(validations.id("word")).to.be.undefined;
    });
    test("accepts uppercase", () => {
        expect(validations.id("Word")).to.be.undefined;
    });
    test("accepts numbers", () => {
        expect(validations.id("word123")).to.be.undefined;
    });
    test("accepts words with - separators", () => {
        expect(validations.id("a-b-c")).to.be.undefined;
    });
    test("rejects underscores", () => {
        expect(validations.id("a_b")).to.eq(errorMessage);
    });
    test("rejects periods", () => {
        expect(validations.id("a.b")).to.eq(errorMessage);
    });
    test("rejects weird chars", () => {
        expect(validations.id("a%b")).to.eq(errorMessage);
        expect(validations.id("a$b")).to.eq(errorMessage);
    });
});
