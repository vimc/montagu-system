import {expect} from "chai";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {touchstoneListPageActionCreators} from "../../../../main/admin/actions/pages/TouchstoneListPageActionCreators";
import {Sandbox} from "../../../Sandbox";
import {adminTouchstoneActionCreators} from "../../../../main/admin/actions/adminTouchstoneActionCreators";
import {mockAction} from "../../../mocks/mocks";
import {mainMenuPageActionCreators} from "../../../../main/admin/actions/pages/MainMenuPageActionCreators";

describe("touchstoneListPageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("gets touchstones on load", async () => {
        const getAllTouchstones = sandbox.setStubFunc(adminTouchstoneActionCreators, "getAllTouchstones", mockAction);

        const store = createMockAdminStore();
        await store.dispatch(touchstoneListPageActionCreators.loadData());

        expect(getAllTouchstones.called).to.be.true;
    });

    it("creates breadcrumbs", () => {

        const result = touchstoneListPageActionCreators.createBreadcrumb();

        expect(result.urlFragment).to.eq("touchstones/");
        expect(result.name).to.eq("Touchstones");
    });

    it("has MainMenu as parent", () => {

        expect(touchstoneListPageActionCreators.parent).to.eq(mainMenuPageActionCreators)
    });

    it("creates title", () => {
        expect(touchstoneListPageActionCreators.title()).to.eq("Touchstones")
    });
});