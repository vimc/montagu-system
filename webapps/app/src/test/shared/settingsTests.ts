
import {settings} from "../../main/shared/Settings";

describe("settings", () => {

    it("disease matching is case insensitive", () => {
        expect(settings.hideWideFormat("measles")).toEqual(true);
        expect(settings.hideWideFormat("Measles")).toEqual(true);
    });

    it("all post 2022 touchstones have no guidance", () => {
        expect(settings.isNoGuidanceTouchstone("2021blahblah")).toEqual(false);
        expect(settings.isNoGuidanceTouchstone("2022blahbalh")).toEqual(true);
        expect(settings.isNoGuidanceTouchstone("2023sblahbalh")).toEqual(true);
    });
});
