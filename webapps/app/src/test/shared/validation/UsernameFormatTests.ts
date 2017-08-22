import * as Validation from "../../../main/shared/Validation";
import { expect } from "chai";
import { ValidationTest } from "./ValidationTestBaseClass";

export class UsernameFormatTests extends ValidationTest {
    errorMessage = "name must be in the format 'something.something'. " +
            "It must be lowercase, and only consist of letters and full stops.";

    name() { return "usernameFormat" }

    makeValidator() { return Validation.usernameFormat("name") }

    tests() {
        it("accepts word", () => {
            expect(() => this.validate("word")).to.not.throw();
        });
        it("rejects numbers", () => {
            expect(() => this.validate("word123")).to.throw(Error, this.errorMessage);
            expect(() => this.validate("123")).to.throw(Error, this.errorMessage);
        });
        it("accepts words with period separators", () => {
            expect(() => this.validate("a.b.c")).to.not.throw();
        });
        it("rejects multiple periods in a row", () => {
            expect(() => this.validate("a..b")).to.throw(Error, this.errorMessage);
        });
        it("rejects capital letters", () => {
            expect(() => this.validate("Word")).to.throw(Error, this.errorMessage);
        });
        it("rejects punctuation", () => {
            expect(() => this.validate("a-b")).to.throw(Error, this.errorMessage);
            expect(() => this.validate("a_b")).to.throw(Error, this.errorMessage);
            expect(() => this.validate("a%b")).to.throw(Error, this.errorMessage);
        });
    }
}