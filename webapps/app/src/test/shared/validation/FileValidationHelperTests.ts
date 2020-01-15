import {checkFileExtensionIsCSV} from "../../../main/shared/validation/FileValidationHelpers";
import {expect} from "chai";

describe('FileValidationHelpers', () => {
    describe("checkFileExtensionIsCSV", () => {
        test("returns isValid if file ends in .csv", () => {
            expect(checkFileExtensionIsCSV("test.csv").isValid).to.be.true;
        });

        test("is case insensitive", () => {
            expect(checkFileExtensionIsCSV("test.other.parts.CSV").isValid).to.be.true;
        });

        test("returns not valid for other extensions", () => {
            expect(checkFileExtensionIsCSV("test.other.parts.xls").isValid).to.be.false;
        });
    });
});