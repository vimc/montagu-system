
import {longDate, longestTimestamp, longTimestamp, padZero} from "../../../main/shared/Helpers";

describe("Date formatting helpers", () => {
    it("can pad single digits to double digits", () => {
        expect(padZero(0)).toEqual("00");
        expect(padZero(4)).toEqual("04");
        expect(padZero(10)).toEqual("10");
        expect(padZero(99)).toEqual("99");
    });

    it("can format long date", () => {
        expect(longDate(new Date(2017, 0, 1))).toEqual("Sun Jan 01 2017");
        expect(longDate(new Date(2017, 3, 13))).toEqual("Thu Apr 13 2017");
        expect(longDate(new Date(2017, 11, 26))).toEqual("Tue Dec 26 2017");
    });

    it("can format long timestamp", () => {
        expect(longTimestamp(new Date(2017, 0, 1, 6, 15, 10))).toEqual("Sun Jan 01 2017, 06:15");
        expect(longTimestamp(new Date(2017, 3, 13, 14, 28, 20))).toEqual("Thu Apr 13 2017, 14:28");
        expect(longTimestamp(new Date(2017, 11, 26, 23, 59, 59))).toEqual("Tue Dec 26 2017, 23:59");
    });

    it("can format longest timestamp", () => {
        expect(longestTimestamp(new Date(2017, 0, 1, 6, 15, 10))).toEqual("Sun Jan 01 2017, 06:15:10");
        expect(longestTimestamp(new Date(2017, 3, 13, 14, 28, 20))).toEqual("Thu Apr 13 2017, 14:28:20");
        expect(longestTimestamp(new Date(2017, 11, 26, 23, 59, 59))).toEqual("Tue Dec 26 2017, 23:59:59");
    });
});