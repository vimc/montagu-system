import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {mockDemographicDataset} from "../../../mocks/mockModels";
import {downloadDemographicsPageActionCreators} from "../../../../main/contrib/actions/pages/downloadDemographicsPageActionCreators";
import {DemographicService} from "../../../../main/contrib/services/DemographicService";
import {DemographicTypes} from "../../../../main/contrib/actionTypes/DemographicTypes";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";

describe("Download Demographic Page actions tests", () => {
    const sandbox = new Sandbox();
    const testDemographicDataSet = mockDemographicDataset();

    afterEach(() => {
        sandbox.restore();
    });

    it("has responsibilities overview page as parent", () => {
        expect(downloadDemographicsPageActionCreators.parent).to.eq(responsibilityOverviewPageActionCreators)
    });

    it("creates breadcrumb", () => {
        const state = mockContribState();
        const result = downloadDemographicsPageActionCreators.createBreadcrumb(state);
        expect(result.urlFragment).to.eq("demographics/");
        expect(result.name).to.eq("Download demographic data sets");
    });

    it("loads demographic data sets", async () => {

        const store = createMockContribStore();

        sandbox.setStubFunc(DemographicService.prototype, "getDataSetsByTouchstoneId", () => {
            return Promise.resolve([testDemographicDataSet]);
        });

        await store.dispatch(downloadDemographicsPageActionCreators
            .loadData({groupId: "g1", touchstoneId: "t1"}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED, data: [testDemographicDataSet]}
        ];
        expect(actions).to.eql(expectedPayload);
    });


});