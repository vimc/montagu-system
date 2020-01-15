import {Sandbox} from "../../Sandbox";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {mockScenarioAndCoverageSets} from "../../mocks/mockModels";
import {createMockAdminStore} from "../../mocks/mockStore";
import {scenarioActionCreators} from "../../../main/admin/actions/scenarioActionCreators";
import {expect} from "chai";
import {ScenarioTypes} from "../../../main/admin/actionTypes/ScenarioTypes";

describe("scenarioActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    test("invokes service and returns scenarios", async () => {
        const store = createMockAdminStore();
        const mockServiceData = [mockScenarioAndCoverageSets()];
        const scenarios = [mockServiceData[0].scenario];

        const serviceStub = sandbox.setStubFunc(
            TouchstonesService.prototype,
            "getScenariosForTouchstoneVersion",
            () => Promise.resolve(mockServiceData)
        );
        await store.dispatch(scenarioActionCreators.getScenariosForTouchstoneVersion("touchstone-1"));

        expect(serviceStub.callCount).to.equal(1, "Expected service to be called once");
        expect(serviceStub.getCall(0).args).to.eql(["touchstone-1"]);
        expect(store.getActions()).to.eql([
            {type: ScenarioTypes.SOME_SCENARIOS_FETCHED, data: scenarios}
        ]);
    });
});
