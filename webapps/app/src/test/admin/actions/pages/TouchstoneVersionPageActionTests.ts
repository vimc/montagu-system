

import {Sandbox} from "../../../Sandbox";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {mockTouchstone, mockTouchstoneVersion} from "../../../mocks/mockModels";
import {touchstonesActionCreators} from "../../../../main/shared/actions/touchstoneActionCreators";
import {mockAdminState} from "../../../mocks/mockStates";
import {touchstoneVersionPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneVersionPageActionCreators";
import {touchstoneDetailsPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneDetailsPageActionCreators";

describe("Touchstone version page actions tests", () => {
    const sandbox = new Sandbox();

    const state = mockAdminState({
        touchstones: {
            touchstones: [mockTouchstone()],
            currentTouchstoneVersion: mockTouchstoneVersion({id: "t1v1", description: "desc"})
        }
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("sets current touchstone version", async () => {

        const store = createMockAdminStore(state);

        const setCurrentStub = sandbox.setStubReduxAction(touchstonesActionCreators, "setCurrentTouchstoneVersion");

        await store.dispatch(touchstoneVersionPageActionCreators
            .loadData({touchstoneVersionId: "t1", touchstoneId: "whatever"}));

        expect(setCurrentStub.called).toBe(true);

    });

    it("creates breadcrumbs", () => {

        const result = touchstoneVersionPageActionCreators.createBreadcrumb(state);

        expect(result.urlFragment).toEqual("t1v1/");
        expect(result.name).toEqual("t1v1");
    });

    it("has touchstone details page as parent", () => {
        expect(touchstoneVersionPageActionCreators.parent).toEqual(touchstoneDetailsPageActionCreators);
    });

    it("has touchstone version description as title", () => {
        expect(touchstoneVersionPageActionCreators.title(state)).toEqual("desc");
    });
});