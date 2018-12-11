import {expect} from "chai";
import * as React from "react";
import {createMemoryHistory} from 'history';

import {
    expectSameElements,
    firstDownloadPromise,
    inflateAndDecode,
    IntegrationTestSuite,
    lastDownloadPromise
} from "./IntegrationTest";
import {Sandbox} from "../test/Sandbox";
import {ArtefactItem} from "../main/report/components/Artefacts/ArtefactItem";
import {ResourceLinks} from "../main/report/components/Resources/ResourceLinks";
import {DataLinks} from "../main/report/components/Data/DataLinks";

import {createReportStore} from "../main/report/stores/createReportStore";
import {ReportsService} from "../main/report/services/ReportsService";
import {ReportVersion} from "../main/shared/models/Generated";
import {UserService} from "../main/report/services/UserService";
import {mockArtefact} from "../test/mocks/mockModels";
import {ReportDownloadsComponent} from "../main/report/components/Reports/ReportDownloads";
import {OneTimeTokenService} from "../main/shared/services/OneTimeTokenService";
import {Provider} from "react-redux";

class ReportIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Reporting portal";
    }

    createStore() {
        const history = createMemoryHistory({
            initialEntries: ['/']
        });
        return createReportStore(history);
    }

    addTestsToMocha() {

        const sandbox = new Sandbox();

        afterEach(() => sandbox.restore());

        it("fetches reports", async () => {
            const expectedNames: string[] = ["minimal", "multi-artefact", "multifile-artefact", "other",
                "use_resource", "html"];
            const reports = await (new ReportsService(this.store.dispatch, this.store.getState)).getAllReports();

            const names = reports.map((item: ReportVersion) => item.name);
            const versions = reports.filter((item: ReportVersion) => item.latest_version.length > 0);

            expectSameElements<string>(names, expectedNames);
            expect(versions.length).to.equal(reports.length);

            const otherReport_versions = reports.filter((item: ReportVersion) => item.name == "other");
            expect(otherReport_versions[0].author).to.equal("Dr Serious");
            expect(otherReport_versions[0].display_name).to.equal("another report");
            expect(otherReport_versions[0].requester).to.equal("ACME");
            expect(otherReport_versions[0].id).to.not.be.empty;
            expect(otherReport_versions[0].latest_version).to.not.be.empty;
            expect(otherReport_versions[0].date).to.not.be.empty;
        });


        it("fetches report readers", async () => {
            const readers = await (new UserService(this.store.dispatch, this.store.getState))
                .getReportReaders("minimal");
            expect(readers.length).to.be.greaterThan(0);
        });

        it("removes a report reader", async () => {
            const result = await (new UserService(this.store.dispatch, this.store.getState))
                .removeReportReader("minimal", "test.user");
            expect(result).to.eq("OK");
        });

        it("adds a report reader", async () => {
            const result = await (new UserService(this.store.dispatch, this.store.getState))
                .addReportReader("minimal", "test.user");
            expect(result).to.eq("OK");
        });

        it("fetches report versions", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("other");
            expect(versions.length).to.be.greaterThan(0);
        });

        it("fetches report version details", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("other");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("other", versions[0]);

            expect(versionDetails.name).is.equal("other");
            expect(versionDetails.author).is.equal("Dr Serious");
            expect(versionDetails.comment).is.equal("This is another comment");
            expect(versionDetails.date).to.not.be.empty;
            expect(versionDetails.displayname).is.equal("another report");
            expect(versionDetails.hash_script).to.not.be.empty;
            expect(versionDetails.id).to.not.be.empty;
            expect(versionDetails.published).is.equal(true);
            expect(versionDetails.script).is.equal("script.R");
            expect(versionDetails.hash_data).to.not.be.null;
            expect(versionDetails.data).to.not.be.null;
            expect(versionDetails.parameters).to.not.be.null;
            expect(versionDetails.resources).to.be.empty;
            expect(versionDetails.artefacts).to.not.be.null;
        });

        it("fetches report changelog details", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("changelog");
            const changelog = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionChangelog("changelog", versions[0]);

            expect(changelog.length).is.greaterThan(0);

            expect(changelog[0].report_version).is.eql(versions[0]);
            expect(changelog[0].label).to.be.oneOf(["internal", "public"]);
            expect(changelog[0].value).to.not.be.empty;
            expect(changelog[0].from_file).to.not.be.null;

        });

        it("fetches one time token", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState))
                .getReportVersions("minimal");
            const token = await (new OneTimeTokenService(this.store.dispatch, this.store.getState))
                .fetchToken(`/reports/minimal/${versions[0]}/artefacts/`, "reporting");
            const decoded = inflateAndDecode(token);
            expect(decoded.url).to.equal(`/v1/reports/minimal/${versions[0]}/artefacts/`);
        });

        it("downloads artefact", async () => {
            const artefact = mockArtefact({filenames: ["all.csv", "all.png"], description: "all things"});
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("multi-artefact");
            const rendered = sandbox.mount(<Provider store={this.store}><ArtefactItem report={"multi-artefact"}
                                                                                      version={versions[0]}
                                                                                      artefact={artefact}/></Provider>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads resource", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("use_resource");
            const rendered = sandbox.mount(<Provider store={this.store}><ResourceLinks report="use_resource"
                                                                                       version={versions[0]}
                                                                                       resources={["meta/data.csv"]}/></Provider>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads data", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = sandbox.mount(<Provider
                store={this.store}><DataLinks {...versionDetails.hash_data}/></Provider>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads zipped report", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = sandbox.mount(<Provider store={this.store}>
                <ReportDownloadsComponent report="minimal" versionDetails={versionDetails}/>
            </Provider>);
            const response = await lastDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });
    }
}

new ReportIntegrationTests();