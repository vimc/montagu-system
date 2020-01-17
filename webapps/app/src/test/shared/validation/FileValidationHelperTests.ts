import {checkFileExtensionIsCSV} from "../../../main/shared/validation/FileValidationHelpers";

describe('FileValidationHelpers', () => {
    describe("checkFileExtensionIsCSV", () => {
        it("returns isValid if file ends in .csv", () => {
            expect(checkFileExtensionIsCSV("test.csv").isValid).toBe(true);
        });

        it("is case insensitive", () => {
            expect(checkFileExtensionIsCSV("test.other.parts.CSV").isValid).toBe(true);
        });

        it("returns not valid for other extensions", () => {
            expect(checkFileExtensionIsCSV("test.other.parts.xls").isValid).toBe(false);
        });
    });
});