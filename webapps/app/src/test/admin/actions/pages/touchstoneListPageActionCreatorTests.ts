import {expect} from "chai";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {touchstoneListPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneListPageActionCreators";
import {Sandbox} from "../../../Sandbox";
import {adminTouchstoneActionCreators} from "../../../../main/admin/actions/adminTouchstoneActionCreators";
import {breadcrumbsActionCreators} from "../../../../main/shared/actions/breadcrumbsActionsCreators";
import {TouchstoneListPageComponent} from "../../../../main/admin/components/Touchstones/List/TouchstoneListPage";
import {mockAction} from "../../../mocks/mocks";
import {MainMenuNew} from "../../../../main/admin/components/MainMenu/MainMenuNew";

describe("touchstoneListPageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("creates breadcrumbs and gets touchstones on load", async () => {
        const getAllTouchstones = sandbox.setStubFunc(adminTouchstoneActionCreators, "getAllTouchstones", mockAction);
        const createBreadcrumbs = sandbox.setStubFunc(breadcrumbsActionCreators, "createBreadcrumbs", mockAction);

        const store = createMockAdminStore();
        await store.dispatch(touchstoneListPageActionCreators.onLoad());

        expect(getAllTouchstones.called).to.be.true;
        expect(createBreadcrumbs.args[0]).to.eql([{
            name: TouchstoneListPageComponent.title,
            parent: MainMenuNew.breadcrumb(),
            urlFragment: "touchstones/"
        }]);
    });
});