import {
    mockCoverageSet,
    mockExtendedResponsibilitySet,
    mockModellingGroup,
    mockResponsibility, mockResponsibilitySet, mockScenario,
    mockScenarioTouchstoneAndCoverageSets,
    mockTouchstone
} from "../../mocks/mockModels";
import { FetchHelper } from "../../shared/fetch/helpers";
import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { alt } from "../../../main/shared/alt";
import { ScenarioTouchstoneAndCoverageSets } from "../../../main/shared/models/Generated";
import { responsibilityActions } from "../../../main/contrib/actions/ResponsibilityActions";
import { coverageSetActions } from "../../../main/contrib/actions/CoverageSetActions";

describe("ResponsibilityStore.fetchCoverageSets", () => {
    const group = mockModellingGroup({ id: "group-id" });
    const touchstone = mockTouchstone({ id: "touchstone-id" });
    const scenario = mockScenario({ id: "scenario-id" })
    const responsibility = mockResponsibility({}, scenario);

    new FetchHelper<ScenarioTouchstoneAndCoverageSets>({
        expectedURL: "/modelling-groups/group-id/responsibilities/touchstone-id/scenario-id/coverage_sets/",
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    currentTouchstone: touchstone,
                    currentModellingGroup: group,
                    currentResponsibility: responsibility
                }
            }));
        },
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                ResponsibilityStore: {
                    touchstones: [ touchstone ],
                    currentTouchstone: touchstone,
                    currentModellingGroup: group,
                    currentResponsibility: responsibility,
                    responsibilitySets: []
                }
            }));
            responsibilityActions.update(mockResponsibilitySet(
                { touchstone: touchstone.id },
                [ responsibility ]
            ));
            coverageSetActions.update({
                scenario: scenario,
                touchstone: touchstone,
                coverage_sets: [ mockCoverageSet() ]
            });
        },
        triggerFetch: () => responsibilityStore.fetchCoverageSets(),
        makePayload: () => mockScenarioTouchstoneAndCoverageSets()
    }).addTestsToMocha();
});