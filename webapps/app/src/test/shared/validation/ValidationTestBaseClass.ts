import * as Validation from "../../../main/shared/validation/Validation";

export abstract class ValidationTest {
    validate: Validation.Validator;

    abstract makeValidator(): Validation.Validator;
    abstract name(): string;
    abstract tests(): void;

    addTestsToMocha() {
        describe(this.name(), () => {
            let testContext: any;

            beforeEach(() => {
                testContext = {};
            });

            beforeEach(() => {
                testContext.validate = testContext.makeValidator();
            });

            this.tests();
        });
    }
}