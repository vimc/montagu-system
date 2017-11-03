import {expect} from "chai";
import {VersionIdentifier} from "../../../main/report/models/VersionIdentifier";

describe("VersionIdentifier", () => {
    it("correctly parses the timestamp", () => {
        const id = new VersionIdentifier("20170101-123015-1234abcd");
        expect(id.timestamp.valueOf()).to.equal(new Date(2017, 0, 1, 12, 30, 15).valueOf());
    });

    it("correctly parses the hash", () => {
        const id = new VersionIdentifier("20170101-123015-1234abcd");
        expect(id.hash).to.equal("1234abcd");
    });

    it("correctly orders", () => {
        const a = new VersionIdentifier("20170101-123000-1234abcd");
        const b = new VersionIdentifier("20170101-123001-1234abcd");
        expect(a.compareTo(b)).to.be.lessThan(0, "A should come before B");
        expect(b.compareTo(a)).to.be.greaterThan(0, "B should come after A");
        expect(a.compareTo(a)).to.be.equal(0, "A should equal A");
    });
});