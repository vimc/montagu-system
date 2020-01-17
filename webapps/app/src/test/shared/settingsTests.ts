
import {settings} from "../../main/shared/Settings";

describe("settings", () => {

    it("disease matching is case insensitive", () => {
        expect(settings.hideWideFormat("measles")).toEqual(true);
        expect(settings.hideWideFormat("Measles")).toEqual(true);
    })
});
