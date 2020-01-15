import {expect} from "chai";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {Sandbox} from "../../../Sandbox";
import {touchstoneDetailsPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneDetailsPageActionCreators";
import {mockAdminState, RecursivePartial} from "../../../mocks/mockStates";
import {AdminTouchstoneState} from "../../../../main/admin/reducers/adminTouchstoneReducer";
import {mockTouchstone} from "../../../mocks/mockModels";
import {touchstoneListPageActionCreators} from "../../../../main/admin/actions/pages/TouchstoneListPageActionCreators";
import {TouchstoneTypes} from "../../../../main/shared/actionTypes/TouchstonesTypes";

describe("touchstoneDetailsPageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const tA = mockTouchstone({id: "tA"});
    const tB = mockTouchstone({id: "tB"});
    const touchstoneState: RecursivePartial<AdminTouchstoneState> = {
        touchstones: [tA, tB],
        currentTouchstone: mockTouchstone({id: "myId", description: "desc of myId"})
    };
    const state = mockAdminState({touchstones: touchstoneState});

    test("sets current touchstone on load", async () => {

        const store = createMockAdminStore(state);
        await store.dispatch(touchstoneDetailsPageActionCreators.loadData({
            touchstoneId: "tB"
        }));
        expect(store.getActions()).to.eql([
            {type: TouchstoneTypes.SET_CURRENT_TOUCHSTONE, data: tB}
        ]);
    });

    test("creates breadcrumbs", () => {

        const result = touchstoneDetailsPageActionCreators.createBreadcrumb(state);

        expect(result.urlFragment).to.eq("myId/");
        expect(result.name).to.eq("myId");
    });

    test("has TouchstoneList as parent", () => {
        expect(touchstoneDetailsPageActionCreators.parent).to.eq(touchstoneListPageActionCreators)
    });

    test("has current touchstone description as title", () => {
        expect(touchstoneDetailsPageActionCreators.title(state)).to.eq("desc of myId")
    });
});