import { FetchHelper } from "../../shared/fetch/helpers";
import { doNothing } from "../../../main/shared/Helpers";
import { alt } from "../../../main/shared/alt";
import {reportStore} from "../../../main/report/stores/ReportStore";

describe("ReportStore.fetchReports", () => {
    new FetchHelper<string[]>({
        makePayload: () => [ "report1", "report2" ],
        prepareForFetch: doNothing,
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                ReportStore: {
                    reports: [ "report1", "report2" ]
                }
            }))
        },
        triggerFetch: () => reportStore.fetchReports(),
        expectedURL: "/reports/"
    }).addTestsToMocha();
});