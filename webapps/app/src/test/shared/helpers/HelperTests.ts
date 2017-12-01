import {expect} from "chai";
import {encodeFilename} from "../../../main/shared/Helpers";

describe("Helpers", () => {
    it("formats links to files in subdirectories", () => {

        const fileName = "dir/subdir/subsubdir/filename.csv";
        const result = encodeFilename(fileName);

        expect(result).to.equal("dir:subdir:subsubdir:filename.csv");
    });
});