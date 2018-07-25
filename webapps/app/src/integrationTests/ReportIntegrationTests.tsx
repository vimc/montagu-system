import {expect} from "chai";
import * as React from "react";
import {ReactWrapper, shallow, ShallowWrapper} from "enzyme";
import {createMemoryHistory} from 'history';

import {expectSameElements, inflateAndDecode, IntegrationTestSuite} from "./IntegrationTest";
import {Sandbox} from "../test/Sandbox";
import {ArtefactItem} from "../main/report/components/Artefacts/ArtefactItem";
import {FileDownloadButton, FileDownloadLink} from "../main/shared/components/FileDownloadLink";
import {ResourceLinks} from "../main/report/components/Resources/ResourceLinks";
import {DataLinks} from "../main/report/components/Data/DataLinks";

import {createReportStore} from "../main/report/stores/createReportStore";
import {ReportsService} from "../main/report/services/ReportsService";
import {Report} from "../main/shared/models/Generated";
import {UserService} from "../main/report/services/UserService";
import {mockArtefact} from "../test/mocks/mockModels";
import {ReportDownloadsComponent} from "../main/report/components/Reports/ReportDownloads";
import {OneTimeTokenService} from "../main/shared/services/OneTimeTokenService";
import {buildReportingURL} from "../main/report/services/AbstractReportLocalService";
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
            const names = reports.map((item: Report) => item.name);
            const versions = reports.filter((item: Report) => item.latest_version.length > 0);
            const otherReport = reports.filter((item: Report) => item.name == "other");

            expectSameElements<string>(names, expectedNames);

            expect(otherReport[0].display_name).to.equal("another report");
            expect(versions.length).to.equal(reports.length);
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
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            expect(versionDetails.name).is.equal("minimal");
        });

        it("fetches one time token", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState))
                .getReportVersions("minimal");
            const token = await (new OneTimeTokenService(this.store.dispatch, this.store.getState))
                .fetchToken(`/reports/minimal/${versions[0]}/artefacts/`);
            const decoded = inflateAndDecode(token);
            expect(decoded.url).to.equal(`/v1/reports/minimal/${versions[0]}/artefacts/`);
        });

        it("downloads artefact", async () => {
            const artefact = mockArtefact({filenames: ["all.csv", "all.png"], description: "all things"});
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("multi-artefact");
            const rendered = sandbox.mount(<Provider store={this.store}><ArtefactItem report={"multi-artefact"} version={versions[0]}
                                                                                      artefact={artefact}/></Provider>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads resource", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("use_resource");
            const rendered = sandbox.mount(<Provider store={this.store}><ResourceLinks report="use_resource" version={versions[0]}
                                                                                       resources={["meta/data.csv"]}/></Provider>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads data", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = sandbox.mount(<Provider store={this.store}><DataLinks {...versionDetails.hash_data}/></Provider>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads zipped report", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = sandbox.mount(<Provider store={this.store}><ReportDownloadsComponent report="minimal"
                                                                                                  versionDetails={versionDetails}
                                                                                                  ready={true}/></Provider>);
            const response = await lastDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        async function firstDownloadPromise(rendered: ReactWrapper) {
            await timeout(100); // wait to make sure onetime token is fetched
            rendered.update(); // mounted component won't update with new props automatically
            const link = rendered.find("a").first();
            const url = link.prop("href");
            return fetch(url)
        }

        async function lastDownloadPromise(rendered: ReactWrapper) {
            await timeout(100); // wait to make sure onetime token is fetched
            rendered.update(); // mounted component won't update with new props automatically
            const link = rendered.find("a").last();
            const url = link.prop("href");
            return fetch(url)
        }

        async function timeout(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}

new ReportIntegrationTests();