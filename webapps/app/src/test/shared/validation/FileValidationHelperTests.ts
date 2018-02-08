import {checkFileExtensionIsCSV} from "../../../main/shared/validation/FileValidationHelpers";
import {expect} from "chai";

describe('FileValidationHelpers', () => {
    describe("checkFileExtensionIsCSV", () => {
        it("returns isValid if file ends in .csv", () => {
            expect(checkFileExtensionIsCSV("test.csv").isValid).to.be.true;
        });

        it("is case insensitive", () => {
            expect(checkFileExtensionIsCSV("test.other.parts.CSV").isValid).to.be.true;
        });

        it("returns not valid for other extensions", () => {
            expect(checkFileExtensionIsCSV("test.other.parts.xls").isValid).to.be.false;
        });
    });
});