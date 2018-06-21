import {expect} from "chai";
import {mainMenuPageActionCreators} from "../../../../main/admin/actions/pages/MainMenuPageActionCreators";

describe("Admin main menu page actions tests", () => {

    it("creates breadcrumbs", () => {

        const result = mainMenuPageActionCreators.createBreadcrumb();
        expect(result.urlFragment).to.eq("/");
        expect(result.name).to.eq("Main menu");

    });

    it("parent is null", () => {

        expect(mainMenuPageActionCreators.parent).to.be.null;

    });

});