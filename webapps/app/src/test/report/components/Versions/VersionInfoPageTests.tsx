import * as React from "react";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {mockLocation} from "../../../mocks/mocks";
import {checkAsync} from "../../../testHelpers";
import {reportStore} from "../../../../main/report/stores/ReportStore";
import {expectOneAction} from "../../../actionHelpers";
import {VersionInfoPage, VersionInfoPageProps} from "../../../../main/report/components/Versions/VersionInfoPage";
import {alt} from "../../../../main/shared/alt";

describe("VersionInfoPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());
    beforeEach(() => {
        alt.bootstrap(JSON.stringify({
            ReportStore: {
                ready: true,
                reports: ["report"],
                currentReport: "",
                currentVersion: "",
                versionDetails: {},
                versions: {}
            }
        }));
    });

    it("triggers actions on load", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchVersions = sandbox.sinon.stub(reportStore, "fetchVersions").returns(Promise.resolve(null));
        const fetchVersionDetails = sandbox.sinon.stub(reportStore, "fetchVersionDetails").returns(Promise.resolve(null));

        const pageProps = mockLocation<VersionInfoPageProps>({report: "reportname", version: "versionname"});
        sandbox.mount(<VersionInfoPage location={pageProps} router={null}/>);

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, { action:  "ReportActions.setCurrentReport", payload: "reportname"}, 0);
            expect(fetchVersions.called).to.equal(true, "Expected fetchVersions to be called");
            afterWait(done, () => {
                expectOneAction(spy, { action:  "ReportActions.setCurrentVersion", payload: "versionname"}, 1);
                expect(fetchVersionDetails.called).to.equal(true, "Expected fetchVersionDetails to be called");
            });
        });
    });
});