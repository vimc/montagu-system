import {expect} from "chai";
import {longDate, longestTimestamp, longTimestamp, padZero} from "../../../main/shared/Helpers";

describe("Date formatting helpers", () => {
    it("can pad single digits to double digits", () => {
        expect(padZero(0)).to.equal("00");
        expect(padZero(4)).to.equal("04");
        expect(padZero(10)).to.equal("10");
        expect(padZero(99)).to.equal("99");
    });

    it("can format long date", () => {
        expect(longDate(new Date(2017, 0, 1))).to.equal("Sun Jan 01 2017");
        expect(longDate(new Date(2017, 3, 13))).to.equal("Thu Apr 13 2017");
        expect(longDate(new Date(2017, 11, 26))).to.equal("Tue Dec 26 2017");
    });

    it("can format long timestamp", () => {
        expect(longTimestamp(new Date(2017, 0, 1, 6, 15, 10))).to.equal("Sun Jan 01 2017, 06:15");
        expect(longTimestamp(new Date(2017, 3, 13, 14, 28, 20))).to.equal("Thu Apr 13 2017, 14:28");
        expect(longTimestamp(new Date(2017, 11, 26, 23, 59, 59))).to.equal("Tue Dec 26 2017, 23:59");
    });

    it("can format longest timestamp", () => {
        expect(longestTimestamp(new Date(2017, 0, 1, 6, 15, 10))).to.equal("Sun Jan 01 2017, 06:15:10");
        expect(longestTimestamp(new Date(2017, 3, 13, 14, 28, 20))).to.equal("Thu Apr 13 2017, 14:28:20");
        expect(longestTimestamp(new Date(2017, 11, 26, 23, 59, 59))).to.equal("Tue Dec 26 2017, 23:59:59");
    });
});