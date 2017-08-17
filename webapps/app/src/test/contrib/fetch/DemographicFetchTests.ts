import { expect } from "chai";
import { FetchHelper } from "../../shared/fetch/helpers";
import { DemographicStatisticType } from "../../../main/shared/models/Generated";
import { demographicStore } from "../../../main/contrib/stores/DemographicStore";
import { touchstoneActions } from "../../../main/contrib/actions/TouchstoneActions";
import { mockDemographicStatisticType, mockTouchstone } from "../../mocks/mockModels";
import { demographicActions } from "../../../main/contrib/actions/DemographicActions";
import { alt } from "../../../main/shared/alt";
import { doNothing } from "../../../main/shared/Helpers";

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

describe("DemographicStore.fetchOneTimeToken", () => {
    const touchstone = mockTouchstone({ id: "touchstoneId" });
    const dataSet = mockDemographicStatisticType({
        sources: ["sourceId"],
        id: "typeId"
    });
    const helper = new FetchHelper<string, string>({
        triggerFetch: () => demographicStore.fetchOneTimeToken(),
        prepareForFetch: () => {
            touchstoneActions.setCurrentTouchstone(touchstone.id);
            demographicActions.update([dataSet]);
            demographicActions.selectDataSet(dataSet.id);
            demographicActions.selectSource(dataSet.sources[0]);
        },
        makePayload: () => "TOKEN",
        expectedURL: "/touchstones/touchstoneId/demographics/sourceId/typeId/get_onetime_link/"
    });

    helper.addTestsToMocha();

    it("does not fetch until all required options are selected", () => {
        const stub = helper.sandbox.stubFetch(demographicStore, "_fetchOneTimeToken");
        const touchstone = mockTouchstone({ id: "touchstoneId" });
        const dataSet = mockDemographicStatisticType({
            sources: ["sourceId"],
            id: "typeId"
        });

        // First, show that it does nothing if no data set is selected
        alt.recycle();
        touchstoneActions.setCurrentTouchstone(touchstone.id);
        demographicActions.update([dataSet]);
        demographicStore.fetchOneTimeToken().catch(doNothing);
        expect(stub.called).to.equal(false, "Fetched token even though data set was not selected");

        // Next, show that it does nothing if no source is selected
        demographicActions.selectDataSet(dataSet.id);
        demographicStore.fetchOneTimeToken().catch(doNothing);
        expect(stub.called).to.equal(false, "Fetched token even though data set was not selected");

        // Next, select a source as well and show that this makes the difference
        demographicActions.selectSource(dataSet.sources[0]);
        demographicStore.fetchOneTimeToken().catch(doNothing);
        expect(stub.called).to.equal(true, "Did not fetch token even though data set was selected");
    });
});