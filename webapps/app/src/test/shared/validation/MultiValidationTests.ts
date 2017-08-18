import { expect } from "chai";
import { ValidationTest } from "./ValidationTestBaseClass";
import { multi, Validator } from "../../../main/shared/Validation";

export class MultiValidationTests extends ValidationTest {
    name() { return "multi"; }

    makeValidator() { return multi("name", []); }

    tests() {
        it("always passes if empty", () => {
            expect(() => this.validate("a string")).to.not.throw();
        });

        it("rejects if any reject", () => {
            const v = (value: string) => {
                multi("name", [acceptor, rejector, acceptor])(value);
            };
            expect(() => v("a string")).to.throw(Error, "name is bad");
        });

        it("rejects if all reject", () => {
            const v = (value: string) => {
                multi("name", [rejector, rejector, rejector])(value);
            };
            expect(() => v("a string")).to.throw(Error, "name is bad");
        });

        it("accepts if all accept", () => {
            const v = (value: string) => {
                multi("name", [acceptor, acceptor, acceptor])(value);
            };
            expect(() => v("a string")).to.not.throw();
        });
    }
}

function acceptor(name: string): Validator {
    return (value: string) => {
        // do nothing
    }
}

function rejector(name: string): Validator {
    return (value: string) => {
        throw Error(`${name} is bad`);
    }
}