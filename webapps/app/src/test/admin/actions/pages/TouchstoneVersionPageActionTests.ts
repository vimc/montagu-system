import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockAdminStore, createMockStore} from "../../../mocks/mockStore";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {mockBreadcrumbs, mockTouchstone, mockTouchstoneVersion, mockUser} from "../../../mocks/mockModels";
import {usersListPageActionCreators} from "../../../../main/admin/actions/pages/usersListPageActionCreators";
import {UsersTypes} from "../../../../main/admin/actionTypes/UsersTypes";
import {UsersService} from "../../../../main/admin/services/UsersService";
import {touchstoneListPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneListPageActionCreators";
import {touchstonesActionCreators} from "../../../../main/shared/actions/touchstoneActionCreators";
import {adminTouchstoneActionCreators} from "../../../../main/admin/actions/adminTouchstoneActionCreators";
import {touchstoneVersionPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneVersionPageActionCreators";
import {mockAdminState} from "../../../mocks/mockStates";

describe("Touchstone version page actions tests", () => {
    const sandbox = new Sandbox();

    const testBreadcrumbs = mockBreadcrumbs();

    afterEach(() => {
        sandbox.restore();
    });

    it("loads data", (done) => {
        const store = createMockAdminStore({touchstones: {touchstones: [mockTouchstone()]}});

        const setCurrentStub = sandbox.setStubReduxAction(touchstonesActionCreators, "setCurrentTouchstoneVersion");
        const responsibilitiesStub = sandbox.setStubReduxAction(adminTouchstoneActionCreators, "getResponsibilitiesForTouchstoneVersion");

        store.dispatch(touchstoneVersionPageActionCreators.loadData({touchstoneVersionId: "t1"}));
        setTimeout(() => {
            expect(setCurrentStub.called).to.be.true;
            expect(responsibilitiesStub.called).to.be.true;
            done();
        });
    });

    it("creates breadcrumbs", () => {
        const state = mockAdminState({
            touchstones: {
                touchstones: [mockTouchstone()],
                currentTouchstoneVersion: mockTouchstoneVersion({id: "t1"})
            }
        });
        sandbox.setStubFunc(touchstoneListPageActionCreators, "createBreadcrumb", () => "test");
        const result = touchstoneVersionPageActionCreators.createBreadcrumb(state);

        expect(result.urlFragment).to.eq("t1/");
        expect(result.name).to.eq("t1");
        expect(result.parent).to.eq("test")
    });

});