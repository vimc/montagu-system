import { alt } from "../../../main/shared/alt";
import {reportStore} from "../../../main/report/stores/ReportStore";
import {ReportingFetchHelper} from "./ReportingFetchHelper";
import {Version} from "../../../main/shared/models/Report";
import {mockVersion} from "../../mocks/mockModels";

describe("ReportStore.fetchReports", () => {
    new ReportingFetchHelper<string[]>({
        makePayload: () => [ "report1", "report2" ],
        prepareForFetch: () => {
            alt.bootstrap(JSON.stringify({
                ReportStore: {
                    reports: [],
                    currentReport: null,
                    versions: {}
                }
            }));
        },
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

describe("ReportStore.fetchVersions", () => {
    new ReportingFetchHelper<string[]>({
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
    new ReportingFetchHelper<Version>({
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
        expectedURL: "/reports/testname/testversion/"
    }).addTestsToMocha();

});