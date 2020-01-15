import {expect} from "chai";
import {encodeFilename, helpers, titleCase} from "../../../main/shared/Helpers";

describe("Helpers", () => {
    test("formats links to files in subdirectories", () => {

        const fileName = "dir/subdir/subsubdir/filename.csv";
        const result = encodeFilename(fileName);

        expect(result).to.equal("dir:subdir:subsubdir:filename.csv");
    });


    describe("titlecase", () => {
        test("can handle one word", () => {
            expect(titleCase("joe")).to.equal("Joe");
        });
        test("can handle numbers", () => {
            expect(titleCase("1joe")).to.equal("1joe");
        });
        test("can handle two words", () => {
            expect(titleCase("joe bloggs")).to.equal("Joe Bloggs");
        });
        test("can handle null", () => {
            expect(titleCase(null)).to.be.null;
        });
        test("can handle empty", () => {
            expect(titleCase("")).to.eq("")
        });
    });

    test("removes query string from URL", () => {
        const url = "http://example.com/?foo=bar&toast=fork";
        expect(helpers.urlWithoutQueryString(url)).to.equal("http://example.com/")
    });

    test("leaves URL without query string unchanged", () => {
        const url = "http://example.com/page/";
        expect(helpers.urlWithoutQueryString(url)).to.equal("http://example.com/page/")
    });
});