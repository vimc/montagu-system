import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {mockTouchstone, mockTouchstoneVersion} from "../../../mocks/mockModels";
import {touchstonesActionCreators} from "../../../../main/shared/actions/touchstoneActionCreators";
import {adminTouchstoneActionCreators} from "../../../../main/admin/actions/adminTouchstoneActionCreators";
import {touchstoneResponsibilitiesPageActionCreators} from
    "../../../../main/admin/actions/pages/TouchstoneResponsibilityPageActionCreators";
import {mockAdminState} from "../../../mocks/mockStates";

describe("Touchstone responsibility page actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("loads data", (done) => {
        const store = createMockAdminStore({touchstones: {touchstones: [mockTouchstone()]}});

        const setCurrentStub = sandbox.setStubReduxAction(touchstonesActionCreators, "setCurrentTouchstoneVersion");
        const responsibilitiesStub =
            sandbox.setStubReduxAction(adminTouchstoneActionCreators, "getResponsibilitiesForTouchstoneVersion");

        store.dispatch(touchstoneResponsibilitiesPageActionCreators
            .loadData({touchstoneVersionId: "t1", touchstoneId: "whatever"}));
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
        const result = touchstoneResponsibilitiesPageActionCreators.createBreadcrumb(state);

        expect(result.urlFragment).to.eq("t1/responsibilities/");
        expect(result.name).to.eq("Responsibility Sets in t1");
    });


});