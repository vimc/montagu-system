import * as Validation from "../../../main/shared/validation/Validation";
import { expect } from "chai";
import { ValidationTest } from "./ValidationTestBaseClass";

export class UsernameFormatTests extends ValidationTest {
    errorMessage = "name must be in the format 'something.something'. " +
            "It must be lowercase, and only consist of letters and full stops.";

    name() { return "usernameFormat" }

    makeValidator() { return Validation.usernameFormat("name") }

    tests() {
        test("accepts word", () => {
            expect(() => this.validate("word")).to.not.throw();
        });
        test("rejects numbers", () => {
            expect(() => this.validate("word123")).to.throw(Error, this.errorMessage);
            expect(() => this.validate("123")).to.throw(Error, this.errorMessage);
        });
        test("accepts words with period separators", () => {
            expect(() => this.validate("a.b.c")).to.not.throw();
        });
        test("rejects multiple periods in a row", () => {
            expect(() => this.validate("a..b")).to.throw(Error, this.errorMessage);
        });
        test("rejects capital letters", () => {
            expect(() => this.validate("Word")).to.throw(Error, this.errorMessage);
        });
        test("rejects punctuation", () => {
            expect(() => this.validate("a-b")).to.throw(Error, this.errorMessage);
            expect(() => this.validate("a_b")).to.throw(Error, this.errorMessage);
            expect(() => this.validate("a%b")).to.throw(Error, this.errorMessage);
        });
    }
}