import { expect } from "chai";
import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import { expectIsEqual, expectSameElements, IntegrationTestSuite } from "./IntegrationTest";
import { reportingAuthStore } from "../main/report/stores/ReportingAuthStore";
import { ReportingFetcher } from "../main/report/sources/ReportingFetcher";
import { reportStore } from "../main/report/stores/ReportStore";
import { checkPromise } from "../test/testHelpers";
import { reportActions } from "../main/report/actions/ReportActions";
import { oneTimeTokenStore } from "../main/report/stores/OneTimeTokenStore";
import { Version } from "../main/shared/models/reports/Report";
import { Sandbox } from "../test/Sandbox";
import { ArtefactItem } from "../main/report/components/Artefacts/ArtefactItem";
import { FileDownloadLink } from "../main/report/components/FileDownloadLink";
import { ResourceLinks } from "../main/report/components/Resources/ResourceLinks";
import { VersionDetails, VersionDetailsComponent } from "../main/report/components/Versions/VersionDetails";
import { DataLinks } from "../main/report/components/Data/DataLinks";

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

        const sandbox = new Sandbox();
        const fetcher = new ReportingFetcher();

        afterEach(() => sandbox.restore());

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

        it("downloads artefact", (done: DoneCallback) => {

            const reportName = "multi-artefact";
            const promise = getVersion(reportName)
                .then((version: string) => {

                    const rendered = shallow(<ArtefactItem report={reportName} version={version}
                                                           filenames={["all.csv", "all.png"]}
                                                           description="all things"/>);

                    return firstDownloadPromise(rendered)

                });

            checkSuccessful(done, promise);
        });

        it("downloads resource", (done: DoneCallback) => {

            const reportName = "use_resource";
            const promise = getVersion(reportName)
                .then((version: string) => {

                    const rendered = shallow(<ResourceLinks report={reportName} version={version}
                                                            resources={["meta/data.csv"]}/>);

                    return firstDownloadPromise(rendered)

                });

            checkSuccessful(done, promise);
        });

        it("downloads data", (done: DoneCallback) => {

            const reportName = "minimal";

            const promise = getVersionDetails(reportName)
                .then((versionDetails: Version) => {

                    const rendered = shallow(<DataLinks {...versionDetails.hash_data}/>);

                    return firstDownloadPromise(rendered)

                });

            checkSuccessful(done, promise);
        });

        it("downloads zipped report", (done: DoneCallback) => {

            const reportName = "minimal";

            const promise = getVersionDetails(reportName)
                .then((versionDetails: Version) => {

                    const rendered = shallow(<VersionDetailsComponent ready={true} report={reportName}
                                                                      versionDetails={versionDetails}/>);
                    return firstDownloadPromise(rendered)
                });

            checkSuccessful(done, promise);
        });

        function firstDownloadPromise(rendered: ShallowWrapper<any, any>) {
            const link = rendered.find(FileDownloadLink).first();

            const url = link.prop("href");
            return fetcher.fetchFromReportingApi(url)
        }

        function getVersion(reportName: string) {
            reportActions.setCurrentReport(reportName);
            return reportStore.fetchVersions()
                .then((versions) => versions[0]);
        }

        function getVersionDetails(reportName: string) {
            reportActions.setCurrentReport(reportName);
            return reportStore.fetchVersions()
                .then((versions) => {
                    reportActions.setCurrentVersion(versions[0]);
                    return reportStore.fetchVersionDetails()
                });
        }

        function checkSuccessful(done: DoneCallback, promise: Promise<any>) {
            checkPromise(done, promise, (response) => {
                expect(response.status).to.equal(200)
            });
        }

    }
}

new ReportIntegrationTests();