import * as Validation from "../../../main/shared/validation/Validation";

export abstract class ValidationTest {
    validate: Validation.Validator;

    abstract makeValidator(): Validation.Validator;
    abstract name(): string;
    abstract tests(): void;

    addTestsToMocha() {
        describe(this.name(), () => {
            beforeEach(() => {
                this.validate = this.makeValidator();
            });

            this.tests();
        });
    }
}