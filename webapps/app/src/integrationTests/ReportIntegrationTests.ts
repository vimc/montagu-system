import { expect } from "chai";
import { expectIsEqual, expectSameElements, IntegrationTestSuite } from "./IntegrationTest";
import { reportingAuthStore } from "../main/report/stores/ReportingAuthStore";
import { ReportingFetcher } from "../main/report/sources/ReportingFetcher";
import { reportStore } from "../main/report/stores/ReportStore";
import { checkPromise } from "../test/testHelpers";
import { reportActions } from "../main/report/actions/ReportActions";
import { oneTimeTokenStore } from "../main/report/stores/OneTimeTokenStore";
import { Version } from "../main/shared/models/reports/Report";

const jwt_decode = require('jwt-decode');

class ReportIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Reporting portal";
    }

    authStore() {
        return reportingAuthStore;
    }

    makeFetcher() {
        return new ReportingFetcher();
    }

    addTestsToMocha() {

        it("fetches reports", (done: DoneCallback) => {
            const promise = reportStore.fetchReports();
            const expected: string[] = ["minimal", "multi-artefact", "multifile-artefact", "other", "use_resource"];

            checkPromise(done, promise, (reports) => expectSameElements<string>(reports, expected));
        });

        it("fetches report versions", (done: DoneCallback) => {
            reportActions.setCurrentReport("minimal");
            const promise = reportStore.fetchVersions();

            checkPromise(done, promise, (versions) => expect(versions.length).to.be.greaterThan(0));
        });

        it("fetches report version details", (done: DoneCallback) => {
            reportActions.setCurrentReport("minimal");
            const promise = reportStore.fetchVersions().then((versions) => {
                reportActions.setCurrentVersion(versions[0]);
                return reportStore.fetchVersionDetails()
            });

            checkPromise(done, promise, (versionDetails) => expectIsEqual(versionDetails.name, "minimal"));
        });

        it("fetches report one time token", (done: DoneCallback) => {

            reportActions.setCurrentReport("minimal");
            let version = "";

            const promise = reportStore.fetchVersions()
                .then((versions) => {
                version = versions[0];

                    reportActions.setCurrentVersion(version);
                    return reportStore.fetchVersionDetails()
                        .then((details: Version) =>
                            oneTimeTokenStore.fetchToken(`/reports/minimal/${version}/artefacts/`))
                });

            checkPromise(done, promise, token => {
                const decoded = jwt_decode(token);
                expect(decoded.url).to.equal(`/v1/reports/minimal/${version}/artefacts/`);

            });
        });

    }
}

new ReportIntegrationTests();