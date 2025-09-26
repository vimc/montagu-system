import {multi, Validator} from "../../../main/shared/validation/Validation";

describe("Multi rule validation", () => {
    const validate = multi("name", []);

    it("always passes if empty", () => {
        expect(() => validate("a string")).not.toThrow();
    });

    it("rejects if any reject", () => {
        const v = (value: string) => {
            multi("name", [acceptor, rejector, acceptor])(value);
        };
        expect(() => v("a string")).toThrow(Error);
    });

    it("rejects if all reject", () => {
        const v = (value: string) => {
            multi("name", [rejector, rejector, rejector])(value);
        };
        expect(() => v("a string")).toThrow(Error);
    });

    it("accepts if all accept", () => {
        const v = (value: string) => {
            multi("name", [acceptor, acceptor, acceptor])(value);
        };
        expect(() => v("a string")).not.toThrow();
    });
});

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