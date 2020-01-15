import {expect} from "chai";
import {mainMenuPageActionCreators} from "../../../../main/admin/actions/pages/MainMenuPageActionCreators";

describe("Admin main menu page actions tests", () => {

    test("creates breadcrumbs", () => {

        const result = mainMenuPageActionCreators.createBreadcrumb();
        expect(result.urlFragment).to.eq("/");
        expect(result.name).to.eq("Main menu");

    });

    test("parent is null", () => {

        expect(mainMenuPageActionCreators.parent).to.be.null;

    });

    test("title is Main menu", () => {

        expect(mainMenuPageActionCreators.title()).to.eq("Main menu");

    });

});