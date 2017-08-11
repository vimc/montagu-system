import { FetchHelper } from "../../shared/fetch/helpers";
import { DemographicStatisticType } from "../../../main/shared/models/Generated";
import { demographicStore } from "../../../main/contrib/stores/DemographicStore";
import { touchstoneActions } from "../../../main/contrib/actions/TouchstoneActions";
import { mockDemographicStatisticType, mockTouchstone } from "../../mocks/mockModels";
import { demographicActions } from "../../../main/contrib/actions/DemographicActions";

describe("DemographicStore.fetchDataSets", () => {
    const touchstone = mockTouchstone();
    new FetchHelper<DemographicStatisticType[], DemographicStatisticType[]>({
        triggerFetch: () => demographicStore.fetchDataSets(),
        prepareForFetch: () => {
            touchstoneActions.setCurrentTouchstone(touchstone.id)
        },
        prepareForCachedFetch: () => {
            touchstoneActions.setCurrentTouchstone(touchstone.id);
            demographicActions.update([mockDemographicStatisticType()])
        },
        makePayload: () => [ mockDemographicStatisticType(), mockDemographicStatisticType() ],
        expectedURL: `/touchstones/${touchstone.id}/demographics/`
    }).addTestsToMocha();
});