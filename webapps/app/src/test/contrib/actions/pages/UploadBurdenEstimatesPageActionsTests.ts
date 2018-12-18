import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {mockResponsibility, mockScenario,} from "../../../mocks/mockModels";
import {uploadBurdenEstimatesPageActionCreators} from "../../../../main/contrib/actions/pages/uploadBurdenEstimatesPageActionCreators";
import {responsibilitiesActionCreators} from "../../../../main/contrib/actions/responsibilitiesActionCreators";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";

describe("Upload burden estimates page actions tests", () => {
    const sandbox = new Sandbox();

    const state = mockContribState({
        responsibilities: {
            currentResponsibility: mockResponsibility({}, mockScenario({
                description: "s1desc",
                id: "s1"
            }))
        }
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("has responsibilities overview as parent", () => {
        expect(uploadBurdenEstimatesPageActionCreators.parent).to.eq(responsibilityOverviewPageActionCreators);
    });

    it("creates breadcrumb", () => {

        const result = uploadBurdenEstimatesPageActionCreators.createBreadcrumb(state);
        expect(result.name).to.eq("Upload central burden estimates for s1desc");
        expect(result.urlFragment).to.eq("burdens/s1/");
    });

    it("sets current responsibility set", async () => {
        const store = createMockContribStore();

        sandbox.stubReduxActionCreator(responsibilitiesActionCreators, "setCurrentResponsibility",
            {type: "test-responsibility-type"});

        await store.dispatch(uploadBurdenEstimatesPageActionCreators
            .loadData({groupId: "g1", touchstoneId: "t1", scenarioId: "s1"}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: "test-responsibility-type", props: "s1"},
        ];
        expect(actions).to.eql(expectedPayload);
    });
});