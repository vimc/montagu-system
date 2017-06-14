import * as Validation from "../../../main/shared/Validation";
import { expect } from "chai";

let validate: Validation.Validator;

describe("Validation", () => {
    describe("required", () => {
        beforeEach(() => {
            validate = Validation.required("name");
        });

        it("does not throw when string is non-empty", () => {
            expect(() => validate("a string")).to.not.throw();
        });
        it("throws when string is null", () => {
            expect(() => validate(null)).to.throw(Error, "name is required");
        });
        it("throws when string is empty", () => {
            expect(() => validate("")).to.throw(Error, "name is required");
        });
        it("throws when string is whitespace", () => {
            expect(() => validate("   ")).to.throw(Error, "name is required");
        });
    });
});