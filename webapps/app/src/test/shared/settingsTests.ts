
import {settings} from "../../main/shared/Settings";

describe("settings", () => {

    it("disease matching is case insensitive", () => {
        expect(settings.hideWideFormat("measles", "")).toEqual(true);
        expect(settings.hideWideFormat("Measles", "")).toEqual(true);
    });

    it("202212 touchstones have no wide format", () => {
        expect(settings.hideWideFormat("", "202212")).toEqual(true);
        expect(settings.hideWideFormat("", "202112")).toEqual(false);
    });

    it("2022 touchstones have no guidance", () => {
        expect(settings.isNoGuidanceTouchstone("2021blahblah")).toEqual(false);
        expect(settings.isNoGuidanceTouchstone("2022blahbalh")).toEqual(true);
        expect(settings.isNoGuidanceTouchstone("2023sblahbalh")).toEqual(false);
    });

    it("all post-2022 touchstones have latest guidance", () => {
        expect(settings.isLatestGuidanceTouchstone("2021blah")).toEqual(false);
        expect(settings.isLatestGuidanceTouchstone("2022blah")).toEqual(false);
        expect(settings.isLatestGuidanceTouchstone("2023blah")).toEqual(true);
        expect(settings.isLatestGuidanceTouchstone("2024blah")).toEqual(true);
    });
});
