import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../Sandbox";
import { mockLocation } from "../../../mocks/mocks";
import { checkAsync } from "../../../testHelpers";
import {reportStore} from "../../../../main/report/stores/ReportStore";
import {expectOneAction, expectOrderedActions} from "../../../actionHelpers";
import {VersionInfoPage, VersionInfoPageProps} from "../../../../main/report/components/Versions/VersionInfoPage";
import { alt } from "../../../../main/shared/alt";

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

    it("triggers setCurrentReport and setCurrentVersions on load", (done: DoneCallback) => {

        const spy = sandbox.dispatchSpy();

        const fetchVersionDetails = sandbox.sinon
            .stub(reportStore, "fetchVersionDetails")
            .returns(Promise.resolve(null));

        const pageProps = mockLocation<VersionInfoPageProps>({ report: "reportname", version: "versionname" });
        sandbox.mount(<VersionInfoPage location={pageProps} />);

        checkAsync(done, () => {
            expectOrderedActions(spy, [{
                action: "ReportActions.setCurrentReport",
                payload: "reportname"
            },{
                action: "ReportActions.setCurrentVersion",
                payload: "versionname"
            }]);

        });
    });


    it("triggers fetchVersions on load", (done: DoneCallback) => {
        const fetchVersionDetails = sandbox.sinon
            .stub(reportStore, "fetchVersionDetails")
            .returns(Promise.resolve(null));

        const pageProps = mockLocation<VersionInfoPageProps>({ report: "reportname", version: "versionname" });
        sandbox.mount(<VersionInfoPage location={pageProps} />);

        checkAsync(done, () => {
            expect(fetchVersionDetails.called).to.equal(true);
        });
    });
});