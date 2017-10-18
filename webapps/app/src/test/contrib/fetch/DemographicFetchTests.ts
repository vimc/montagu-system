import { expect } from "chai";
import { FetchHelper } from "../../shared/fetch/helpers";
import { DemographicDataset } from "../../../main/shared/models/Generated";
import { demographicStore } from "../../../main/contrib/stores/DemographicStore";
import { touchstoneActions } from "../../../main/contrib/actions/TouchstoneActions";
import { mockDemographicDataset, mockTouchstone } from "../../mocks/mockModels";
import { demographicActions } from "../../../main/contrib/actions/DemographicActions";
import { alt } from "../../../main/shared/alt";
import { doNothing } from "../../../main/shared/Helpers";
import { checkAsync } from "../../testHelpers";

describe("DemographicStore.fetchDataSets", () => {
    const touchstone = mockTouchstone();
    new FetchHelper<DemographicDataset[], DemographicDataset[]>({
        triggerFetch: () => demographicStore.fetchDataSets(),
        prepareForFetch: () => {
            touchstoneActions.setCurrentTouchstone(touchstone.id)
        },
        prepareForCachedFetch: () => {
            touchstoneActions.setCurrentTouchstone(touchstone.id);
            demographicActions.update([mockDemographicDataset()])
        },
        makePayload: () => [ mockDemographicDataset(), mockDemographicDataset() ],
        expectedURL: `/touchstones/${touchstone.id}/demographics/`
    }).addTestsToMocha();
});

describe("DemographicStore.fetchOneTimeToken", () => {
    const touchstone = mockTouchstone({ id: "touchstoneId" });
    const dataSet = mockDemographicDataset({
        source: "sourceId",
        id: "typeId",
        gender_is_applicable: true
    });
    const helper = new FetchHelper<string, string>({
        triggerFetch: () => demographicStore.fetchOneTimeToken(),
        prepareForFetch: () => {
            touchstoneActions.setCurrentTouchstone(touchstone.id);
            demographicActions.update([dataSet]);
            demographicActions.selectDataSet(dataSet.id);
            demographicActions.selectGender("female");
        },
        makePayload: () => "TOKEN",
        expectedURL: "/touchstones/touchstoneId/demographics/sourceId/typeId/get_onetime_link/?gender=female"
    });

    helper.addTestsToMocha();

    it("does not include gender parameter where it is not applicable", (done: DoneCallback) => {
        const touchstone = mockTouchstone({ id: "touchstoneId" });
        const dataSet = mockDemographicDataset({ id: "typeId", gender_is_applicable: false });
        touchstoneActions.setCurrentTouchstone(touchstone.id);
        demographicActions.update([dataSet]);
        demographicActions.selectDataSet(dataSet.id);

        const fetcherSpy = helper.getFetcherSpy();
        demographicStore.fetchOneTimeToken().catch(doNothing);
        checkAsync(done, () => {
            expect(fetcherSpy.args).to.have.length(1, "Fetch method was not invoked");
            expect(fetcherSpy.args[0][0]).to.equal("/touchstones/touchstoneId/demographics/source1/typeId/get_onetime_link/");
        });
    });

    it("does not fetch until dataset is selected", () => {
        const stub = helper.sandbox.stubFetch(demographicStore, "_fetchOneTimeToken");
        const touchstone = mockTouchstone({ id: "touchstoneId" });
        const dataSet = mockDemographicDataset({
            sources: ["source1" ],
            id: "typeId"
        });

        // show that it does nothing if no data set is selected
        alt.recycle();
        touchstoneActions.setCurrentTouchstone(touchstone.id);
        demographicActions.update([dataSet]);
        demographicStore.fetchOneTimeToken().catch(doNothing);
        expect(stub.called).to.equal(false, "Fetched token even though data set was not selected");

        // Next, select a dataset as well and show that it does fetch
        demographicActions.selectDataSet(dataSet.id);
        demographicStore.fetchOneTimeToken().catch(doNothing);
        expect(stub.called).to.equal(false, "Did not fetch token even though data set was selected");

    });
});