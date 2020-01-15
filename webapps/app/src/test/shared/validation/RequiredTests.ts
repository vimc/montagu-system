import * as Validation from "../../../main/shared/validation/Validation";
import { expect } from "chai";
import { ValidationTest } from "./ValidationTestBaseClass";

export class RequiredTests extends ValidationTest {
    name() { return "required"; }

    makeValidator() { return Validation.required("name"); }

    tests() {
        test("does not throw when string is non-empty", () => {
            expect(() => this.validate("a string")).to.not.throw();
        });
        test("throws when string is null", () => {
            expect(() => this.validate(null)).to.throw(Error, "name is required");
        });
        test("throws when string is empty", () => {
            expect(() => this.validate("")).to.throw(Error, "name is required");
        });
        test("throws when string is whitespace", () => {
            expect(() => this.validate("   ")).to.throw(Error, "name is required");
        });
    }
}