import { alt } from "../../../main/shared/alt";
import {reportStore} from "../../../main/report/stores/ReportStore";
import {ReportingFetchHelper} from "./ReportingFetchHelper";
import {Version} from "../../../main/shared/models/reports/Report";
import { mockReport, mockVersion } from "../../mocks/mockModels";
import { Report } from "../../../main/shared/models/Generated";


describe("ReportStore.fetchVersions", () => {
    new ReportingFetchHelper<string[], string[]>({
        makePayload: () => [ "version1", "version2" ],
        prepareForFetch:() => {
            alt.bootstrap(JSON.stringify({
                ReportStore: {
                    currentReport: "testname",
                    versions: {}
                }
            }));
        },
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                ReportStore: {
                    currentReport: "testname",
                    versions: { "testname": ["version1", "version1"] }
                }
            }))
        },
        triggerFetch: () => reportStore.fetchVersions(),
        expectedURL: "/reports/testname/"
    }).addTestsToMocha();

});


describe("ReportStore.fetchVersionDetails", () => {
    new ReportingFetchHelper<Version, Version>({
        makePayload: () => mockVersion(),
        prepareForFetch:() => {
            alt.bootstrap(JSON.stringify({
                ReportStore: {
                    currentReport: "testname",
                    currentVersion: "testversion",
                    versionDetails: {}
                }
            }));
        },
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                ReportStore: {
                    currentReport: "testname",
                    currentVersion: "testversion",
                    versionDetails: { "testversion": mockVersion() }
                }
            }))
        },
        triggerFetch: () => reportStore.fetchVersionDetails(),
        expectedURL: "/reports/testname/versions/testversion/"
    }).addTestsToMocha();

});