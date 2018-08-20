import {scenarioInitialState, scenarioReducer, ScenarioState} from "../../../main/admin/reducers/scenarioReducer";
import {ScenarioTypes} from "../../../main/admin/actionTypes/ScenarioTypes";
import {mockScenario} from "../../mocks/mockModels";
import {expect} from "chai";

describe("scenarioReducer", () => {
    it("sets scenarios when state is empty", () => {
        const s1 = mockScenario();
        const s2 = mockScenario();

        expect(scenarioReducer(undefined, {
            type: ScenarioTypes.SOME_SCENARIOS_FETCHED,
            data: [s1, s2]
        })).to.eql({...scenarioInitialState, scenarios: [s1, s2]});
    });

    it("adds new distinct scenarios and orders them by ID", () => {
        const s1 = mockScenario({ id: "s1" });
        const s2 = mockScenario({ id: "s2" });
        const s3 = mockScenario({ id: "s3" });

        const state: ScenarioState = {
            scenarios: [s2, s3]
        };

        expect(scenarioReducer(state, {
            type: ScenarioTypes.SOME_SCENARIOS_FETCHED,
            data: [s1, s2]
        })).to.eql({...scenarioInitialState, scenarios: [s1, s2, s3]});
    });
});