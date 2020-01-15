import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {mockDemographicDataset} from "../../../mocks/mockModels";
import {DemographicService} from "../../../../main/shared/services/DemographicService";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";
import {downloadDemographicsContribPageActionCreators} from "../../../../main/contrib/actions/pages/downloadDemographicsContribPageActionCreators";
import {DemographicTypes} from "../../../../main/shared/actionTypes/DemographicTypes";
import {DemographicDataset} from "../../../../main/shared/models/Generated";

describe("Download Demographic Contrib Page actions tests", () => {
    const sandbox = new Sandbox();
    const testDemographicDataSet = mockDemographicDataset();

    afterEach(() => {
        sandbox.restore();
    });

    test("has responsibilities overview page as parent", () => {
        expect(downloadDemographicsContribPageActionCreators.parent).to.eq(responsibilityOverviewPageActionCreators)
    });

    test("creates breadcrumb", () => {
        const state = mockContribState();
        const result = downloadDemographicsContribPageActionCreators.createBreadcrumb(state);
        expect(result.urlFragment).to.eq("demographics/");
        expect(result.name).to.eq("Download demographic data sets");
    });

    test("loads demographic data sets", async () => {

        const store = createMockContribStore();

        sandbox.setStubFunc(DemographicService.prototype, "getDataSetsByTouchstoneVersionId", () => {
            return Promise.resolve([testDemographicDataSet]);
        });

        await store.dispatch(downloadDemographicsContribPageActionCreators
            .loadData({groupId: "g1", touchstoneId: "t1"}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET, data: null as DemographicDataset},
            {type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED, data: [testDemographicDataSet]}
        ];
        expect(actions).to.eql(expectedPayload);
    });


});