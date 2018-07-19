import {expect} from "chai";
import * as React from "react";
import {shallow, ShallowWrapper} from "enzyme";
import {createMemoryHistory} from 'history';

import {expectSameElements, inflateAndDecode, IntegrationTestSuite} from "./IntegrationTest";
import {Sandbox} from "../test/Sandbox";
import {ArtefactItem} from "../main/report/components/Artefacts/ArtefactItem";
import {FileDownloadButton, FileDownloadLink} from "../main/report/components/FileDownloadLink";
import {ResourceLinks} from "../main/report/components/Resources/ResourceLinks";
import {DataLinks} from "../main/report/components/Data/DataLinks";

import {createReportStore} from "../main/report/stores/createReportStore";
import {ReportsService} from "../main/report/services/ReportsService";
import {Report} from "../main/shared/models/Generated";
import {UserService} from "../main/report/services/UserService";
import {mockArtefact} from "../test/mocks/mockModels";
import {ReportDownloadsComponent} from "../main/report/components/Reports/ReportDownloads";
import {OneTimeTokenService} from "../main/report/services/OneTimeTokenService";
import {AbstractReportLocalService} from "../main/report/services/AbstractReportLocalService";

const jwt_decode = require('jwt-decode');

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
            const rendered = shallow(<ArtefactItem report={"multi-artefact"} version={versions[0]}
                                                   artefact={artefact}/>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads resource", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("use_resource");
            const rendered = shallow(<ResourceLinks report="use_resource" version={versions[0]}
                                                    resources={["meta/data.csv"]}/>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads data", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = shallow(<DataLinks {...versionDetails.hash_data}/>);
            const response = await firstDownloadPromise(rendered);
            expect(response.status).to.equal(200)
        });

        it("downloads zipped report", async () => {
            const versions = await (new ReportsService(this.store.dispatch, this.store.getState)).getReportVersions("minimal");
            const versionDetails = await (new ReportsService(this.store.dispatch, this.store.getState)).getVersionDetails("minimal", versions[0]);
            const rendered = shallow(<ReportDownloadsComponent report="minimal" versionDetails={versionDetails} ready={true}/>);
            const response = await firstDownloadButtonPromise(rendered);
            expect(response.status).to.equal(200)
        });

        function firstDownloadPromise(rendered: ShallowWrapper<any, any>) {
            const link = rendered.find(FileDownloadLink).first();

            const url = link.prop("href");
            return helperService.fetchAnything(url)
        }


        function firstDownloadButtonPromise(rendered: ShallowWrapper<any, any>) {
            const link = rendered.find(FileDownloadButton).first();

            const url = link.prop("href");
            return helperService.fetchAnything(url)
        }

        class HelperService extends AbstractReportLocalService {
            fetchAnything(url: string) {
                return this.doFetch(url)
            }
        }

        const helperService = new HelperService(this.store.dispatch, this.store.getState)

    }
}

new ReportIntegrationTests();