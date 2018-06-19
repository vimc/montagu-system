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

describe("Touchstone version page actions tests", () => {
    const sandbox = new Sandbox();

    const testBreadcrumbs = mockBreadcrumbs();

    afterEach(() => {
        sandbox.restore();
    });

    it("loads data", (done) => {
        const store = createMockAdminStore({touchstones: {touchstones: [mockTouchstone()]}});

        const parentStub = sandbox.setStubReduxAction(touchstoneListPageActionCreators, "loadData");
        const setCurrentStub = sandbox.setStubReduxAction(touchstonesActionCreators, "setCurrentTouchstoneVersion");
        const responsibilitiesStub = sandbox.setStubReduxAction(adminTouchstoneActionCreators, "getResponsibilitiesForTouchstoneVersion");

        store.dispatch(touchstoneVersionPageActionCreators.loadData({touchstoneVersionId: "t1"}));
        setTimeout(() => {
            expect(parentStub.called).to.be.true;
            expect(setCurrentStub.called).to.be.true;
            expect(responsibilitiesStub.called).to.be.true;
            done();
        });
    });

});