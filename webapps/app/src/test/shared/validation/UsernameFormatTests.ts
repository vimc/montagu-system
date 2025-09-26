import * as Validation from "../../../main/shared/validation/Validation";

describe("Username format validation", () => {
    const validate = Validation.usernameFormat("name");

    it("accepts word", () => {
        expect(() => validate("word")).not.toThrow();
    });

    it("rejects numbers", () => {
        expect(() => validate("word123")).toThrow(Error);
        expect(() => validate("123")).toThrow(Error);
    });

    it("accepts words with period separators", () => {
        expect(() => validate("a.b.c")).not.toThrow();
    });

    it("rejects multiple periods in a row", () => {
        expect(() => validate("a..b")).toThrow(Error);
    });

    it("rejects capital letters", () => {
        expect(() => validate("Word")).toThrow(Error);
    });

    it("rejects punctuation", () => {
        expect(() => validate("a-b")).toThrow(Error);
        expect(() => validate("a_b")).toThrow(Error);
        expect(() => validate("a%b")).toThrow(Error);
    });
});