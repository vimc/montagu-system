import {Sandbox} from "../../Sandbox";
import {TouchstonesService} from "../../../main/shared/services/TouchstonesService";
import {mockScenarioAndCoverageSets} from "../../mocks/mockModels";
import {createMockAdminStore} from "../../mocks/mockStore";
import {scenarioActionCreators} from "../../../main/admin/actions/scenarioActionCreators";

import {ScenarioTypes} from "../../../main/admin/actionTypes/ScenarioTypes";

describe("scenarioActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("invokes service and returns scenarios", async () => {
        const store = createMockAdminStore();
        const mockServiceData = [mockScenarioAndCoverageSets()];
        const scenarios = [mockServiceData[0].scenario];

        const serviceStub = sandbox.setStubFunc(
            TouchstonesService.prototype,
            "getScenariosForTouchstoneVersion",
            () => Promise.resolve(mockServiceData)
        );
        await store.dispatch(scenarioActionCreators.getScenariosForTouchstoneVersion("touchstone-1"));

        expect(serviceStub.mock.calls.length).toEqual(1);
        expect(serviceStub.mock.calls[0]).toEqual(["touchstone-1"]);
        expect(store.getActions()).toEqual([
            {type: ScenarioTypes.SOME_SCENARIOS_FETCHED, data: scenarios}
        ]);
    });
});
