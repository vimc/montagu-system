import {expect} from "chai";
import * as React from "react";
import {shallow, ShallowWrapper} from "enzyme";
import {expectIsEqual, expectSameElements, IntegrationTestSuite} from "./IntegrationTest";
import {ReportingFetcher} from "../main/report/sources/ReportingFetcher";
import {reportStore} from "../main/report/stores/ReportStore";
import {checkPromise} from "../test/testHelpers";
import {reportActions} from "../main/report/actions/ReportActions";
import {oneTimeTokenStore} from "../main/report/stores/OneTimeTokenStore";
import {Version} from "../main/shared/models/reports/Report";
import {Sandbox} from "../test/Sandbox";
import {ArtefactItem} from "../main/report/components/Artefacts/ArtefactItem";
import {FileDownloadLink} from "../main/report/components/FileDownloadLink";
import {ResourceLinks} from "../main/report/components/Resources/ResourceLinks";
import {DataLinks} from "../main/report/components/Data/DataLinks";
import {ArtefactsSection} from "../main/report/components/Artefacts/ArtefactsSection";

import {createReportStore} from "../main/report/stores/createReportStore";
import {ReportsService} from "../main/report/services/ReportsService";
import {Report} from "../main/shared/models/Generated";

const jwt_decode = require('jwt-decode');

class ReportIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Reporting portal";
    }

    createStore() {
        return createReportStore();
    }


    makeFetcher() {
        return new ReportingFetcher();
    }

    addTestsToMocha() {

        const sandbox = new Sandbox();
        const fetcher = new ReportingFetcher();

        afterEach(() => sandbox.restore());

        it("publishes report", (done: DoneCallback) => {

            const reportName = "use_resource";
            const promise = getVersion(reportName)
                .then((version: string) =>
                    (new ReportsService(this.store.dispatch, this.store.getState))
                        .publishReport(reportName, version)
                );

            checkSuccessful(done, promise);
        });

        it("unpublishes report", (done: DoneCallback) => {

            const reportName = "use_resource";
            const promise = getVersion(reportName)
                .then((version: string) =>
                    (new ReportsService(this.store.dispatch, this.store.getState))
                        .unPublishReport(reportName, version)
                );

            checkSuccessful(done, promise);
        });

        it("fetches reports", async () => {
            const expectedNames: string[] = ["minimal", "multi-artefact", "multifile-artefact", "other", "use_resource"];
            const reports = await (new ReportsService(this.store.dispatch, this.store.getState)).getAllReports();
            const names = reports.map((item: Report) => item.name);
            const versions = reports.filter((item: Report) => item.latest_version.length > 0);
            const otherReport = reports.filter((item: Report) => item.name == "other");

            expectSameElements<string>(names, expectedNames);

            expect(otherReport[0].display_name).to.equal("another report");
            expect(versions.length).to.equal(reports.length);
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

                    const rendered = shallow(<ArtefactsSection
                        report={reportName}
                        versionDetails={versionDetails}
                    />);
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