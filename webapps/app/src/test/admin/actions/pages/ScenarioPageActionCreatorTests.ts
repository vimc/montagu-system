
import {createMockAdminStore} from "../../../mocks/mockStore";
import {Sandbox} from "../../../Sandbox";
import {RecursivePartial} from "../../../mocks/mockStates";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";
import {scenarioPageActionCreators} from "../../../../main/admin/actions/pages/ScenarioPageActionCreators";
import {scenarioActionCreators} from "../../../../main/admin/actions/scenarioActionCreators";
import {AdminAppState} from "../../../../main/admin/reducers/adminAppReducers";
import {diseasesActionCreators} from "../../../../main/shared/actions/diseasesActionCreators";

describe("scenarioPageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("fetches scenarios and diseases on load", async () => {
        const getScenariosStub = sandbox.setStubReduxAction(scenarioActionCreators, "getScenariosForTouchstoneVersion");
        const getDiseasesStub = sandbox.setStubReduxAction(diseasesActionCreators, "getAllDiseases");
        const store = createMockAdminStore();
        await store.dispatch(scenarioPageActionCreators.loadData({
            touchstoneId: "touchstone",
            touchstoneVersionId: "touchstone-1"
        }));
        expect(getScenariosStub.callCount).toEqual(1);
        expect(getScenariosStub.getCall(0).args).toEqual(["touchstone-1"]);
        expect(getDiseasesStub.callCount).toEqual(1);
        expect(getDiseasesStub.getCall(0).args).toEqual([]);
    });

    it("creates breadcrumbs", () => {
        const result = scenarioPageActionCreators.createBreadcrumb(null);
        expect(result.urlFragment).toEqual("scenarios/");
        expect(result.name).toEqual("Scenarios");
    });

    it("has correct title", () => {
        const state: RecursivePartial<AdminAppState> = {
            touchstones: {
                currentTouchstoneVersion: mockTouchstoneVersion({ description: "Tasty" })
            }
        };
        expect(scenarioPageActionCreators.title(state as AdminAppState)).toEqual("Scenarios in Tasty");
    });
});