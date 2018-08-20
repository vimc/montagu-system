import {expect} from "chai";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {Sandbox} from "../../../Sandbox";
import {touchstoneDetailsPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneDetailsPageActionCreators";
import {mockAdminState, RecursivePartial} from "../../../mocks/mockStates";
import {AdminTouchstoneState} from "../../../../main/admin/reducers/adminTouchstoneReducer";
import {mockTouchstone, mockTouchstoneVersion} from "../../../mocks/mockModels";
import {touchstoneListPageActionCreators} from "../../../../main/admin/actions/pages/TouchstoneListPageActionCreators";
import {TouchstoneTypes} from "../../../../main/shared/actionTypes/TouchstonesTypes";
import {scenarioPageActionCreators} from "../../../../main/admin/actions/pages/ScenarioPageActionCreators";
import {scenarioActionCreators} from "../../../../main/admin/actions/scenarioActionCreators";
import {AdminAppState} from "../../../../main/admin/reducers/adminAppReducers";

describe("scenarioPageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("fetches scenarios on load", async () => {
        const getScenariosStub = sandbox.setStubReduxAction(scenarioActionCreators, "getScenariosForTouchstoneVersion")
        const store = createMockAdminStore();
        await store.dispatch(scenarioPageActionCreators.loadData({
            touchstoneId: "touchstone",
            touchstoneVersionId: "touchstone-1"
        }));
        expect(getScenariosStub.callCount).to.equal(1, "Expected stub to be called once");
        expect(getScenariosStub.getCall(0).args).to.eql(["touchstone-1"]);
    });

    it("creates breadcrumbs", () => {
        const result = scenarioPageActionCreators.createBreadcrumb(null);
        expect(result.urlFragment).to.eq("scenarios/");
        expect(result.name).to.eq("Scenarios");
    });

    it("has correct title", () => {
        const state: RecursivePartial<AdminAppState> = {
            touchstones: {
                currentTouchstoneVersion: mockTouchstoneVersion({ description: "Tasty" })
            }
        };
        expect(scenarioPageActionCreators.title(state as AdminAppState)).to.eq("Scenarios in Tasty");
    });
});