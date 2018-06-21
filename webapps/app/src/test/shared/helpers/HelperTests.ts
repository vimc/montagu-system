import {expect} from "chai";
import {encodeFilename, titleCase} from "../../../main/shared/Helpers";

describe("Helpers", () => {
    it("formats links to files in subdirectories", () => {

        const fileName = "dir/subdir/subsubdir/filename.csv";
        const result = encodeFilename(fileName);

        expect(result).to.equal("dir:subdir:subsubdir:filename.csv");
    });


    describe("titlecase", () => {
        it("can handle one word", () => {
            expect(titleCase("joe")).to.equal("Joe");
        });
        it("can handle numbers", () => {
            expect(titleCase("1joe")).to.equal("1joe");
        });
        it("can handle two words", () => {
            expect(titleCase("joe bloggs")).to.equal("Joe Bloggs");
        });
        it("can handle null", () => {
            expect(titleCase(null)).to.be.null;
        });
        it("can handle empty", () => {
            expect(titleCase("")).to.eq("")
        });
    });
});