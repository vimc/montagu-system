import {expect} from "chai";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {Sandbox} from "../../../Sandbox";
import {touchstoneDetailsPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneDetailsPageActionCreators";
import {mockAdminState} from "../../../mocks/mockStates";
import {AdminTouchstoneState} from "../../../../main/admin/reducers/adminTouchstoneReducer";
import {mockTouchstone} from "../../../mocks/mockModels";
import {touchstoneListPageActionCreators} from "../../../../main/admin/actions/pages/TouchstoneListPageActionCreators";
import {TouchstoneTypes} from "../../../../main/shared/actionTypes/TouchstonesTypes";

describe("touchstoneDetailsPageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("sets current touchstone on load", async () => {
        const tA = mockTouchstone({id: "tA"});
        const tB = mockTouchstone({id: "tB"});
        const touchstoneState: Partial<AdminTouchstoneState> = {touchstones: [tA, tB]};
        const store = createMockAdminStore({touchstones: touchstoneState});
        await store.dispatch(touchstoneDetailsPageActionCreators.loadData({
            touchstoneId: "tB"
        }));
        expect(store.getActions()).to.eql([
            {type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE, data: tB}
        ]);
    });

    it("creates breadcrumbs", () => {
        const touchstoneState: Partial<AdminTouchstoneState> = {
            currentTouchstone: mockTouchstone({id: "myId"})
        };
        const state = mockAdminState({touchstones: touchstoneState});
        const result = touchstoneDetailsPageActionCreators.createBreadcrumb(state);

        expect(result.urlFragment).to.eq("myId/");
        expect(result.name).to.eq("myId");
    });

    it("has TouchstoneList as parent", () => {
        expect(touchstoneDetailsPageActionCreators.parent).to.eq(touchstoneListPageActionCreators)
    });
});