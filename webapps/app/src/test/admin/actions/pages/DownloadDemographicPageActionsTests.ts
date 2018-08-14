import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {DemographicTypes} from "../../../../main/shared/actionTypes/DemographicTypes";
import {downloadDemographicsAdminPageActionCreators} from "../../../../main/admin/actions/pages/downloadDemographicsAdminPageActionCreators";
import {DemographicService} from "../../../../main/contrib/services/DemographicService";
import {mockDemographicDataset} from "../../../mocks/mockModels";
import {touchstoneVersionPageActionCreators} from "../../../../main/admin/actions/pages/touchstoneVersionPageActionCreators";

describe("Download Demographic Admin Page actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("creates breadcrumb", () => {
        const result = downloadDemographicsAdminPageActionCreators.createBreadcrumb();
        expect(result.urlFragment).to.eq("demographics/");
        expect(result.name).to.eq("Download demographic data sets");
    });

    it("has touchstone version page as parent", () => {

        expect(downloadDemographicsAdminPageActionCreators.parent).to.eq(touchstoneVersionPageActionCreators);
    });

    it("loads demographic data sets", async () => {

        const store = createMockContribStore();

        const testDemographicDataSet = mockDemographicDataset();

        sandbox.setStubFunc(DemographicService.prototype, "getDataSetsByTouchstoneVersionId", () => {
            return Promise.resolve([testDemographicDataSet]);
        });

        await store.dispatch(downloadDemographicsAdminPageActionCreators
            .loadData({touchstoneVersionId: "t1v1", touchstoneId: "t1"}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED, data: [testDemographicDataSet]}
        ];
        expect(actions).to.eql(expectedPayload);
    });


});