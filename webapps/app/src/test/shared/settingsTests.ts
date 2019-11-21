import {expect} from "chai";
import {settings} from "../../main/shared/Settings";

describe("settings", () => {

    it("disease matching is case insensitive", () => {
        expect(settings.hideWideFormat("measles")).to.eq(true);
        expect(settings.hideWideFormat("Measles")).to.eq(true);
    })
});
