import * as Validation from "../../../main/shared/validation/Validation";

describe("Required validation", () => {
    const validate = Validation.required("name");

    it("does not throw when string is non-empty", () => {
        expect(() => validate("a string")).not.toThrow();
    });
    it("throws when string is null", () => {
        expect(() => validate(null)).toThrow(Error);
    });
    it("throws when string is empty", () => {
        expect(() => validate("")).toThrow(Error);
    });
    it("throws when string is whitespace", () => {
        expect(() => validate("   ")).toThrow(Error);
    });
});
