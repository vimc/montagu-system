
import {mainMenuPageActionCreators} from "../../../../main/admin/actions/pages/MainMenuPageActionCreators";

describe("Admin main menu page actions tests", () => {

    it("creates breadcrumbs", () => {

        const result = mainMenuPageActionCreators.createBreadcrumb();
        expect(result.urlFragment).toEqual("/");
        expect(result.name).toEqual("Main menu");

    });

    it("parent is null", () => {

        expect(mainMenuPageActionCreators.parent).toBe(null);

    });

    it("title is Main menu", () => {

        expect(mainMenuPageActionCreators.title()).toEqual("Main menu");

    });

});