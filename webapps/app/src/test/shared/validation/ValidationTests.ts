import { RequiredTests } from "./RequiredTests";
import { UsernameFormatTests } from "./UsernameFormatTests";
import { MultiValidationTests } from "./MultiValidationTests";

describe("Validation", () => {
    new RequiredTests().addTestsToMocha();
    new UsernameFormatTests().addTestsToMocha();
    new MultiValidationTests().addTestsToMocha();
});