import * as Validation from "../../../main/shared/validation/Validation";
import { expect } from "chai";
import { ValidationTest } from "./ValidationTestBaseClass";

export class RequiredTests extends ValidationTest {
    name() { return "required"; }

    makeValidator() { return Validation.required("name"); }

    tests() {
        it("does not throw when string is non-empty", () => {
            expect(() => this.validate("a string")).to.not.throw();
        });
        it("throws when string is null", () => {
            expect(() => this.validate(null)).to.throw(Error, "name is required");
        });
        it("throws when string is empty", () => {
            expect(() => this.validate("")).to.throw(Error, "name is required");
        });
        it("throws when string is whitespace", () => {
            expect(() => this.validate("   ")).to.throw(Error, "name is required");
        });
    }
}