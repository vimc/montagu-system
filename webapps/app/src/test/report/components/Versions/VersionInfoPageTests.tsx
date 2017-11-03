import * as React from "react";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {mockLocation} from "../../../mocks/mocks";
import {checkAsync} from "../../../testHelpers";
import {reportStore} from "../../../../main/report/stores/ReportStore";
import {expectOneAction} from "../../../actionHelpers";
import {VersionInfoPage, VersionInfoPageProps} from "../../../../main/report/components/Versions/VersionInfoPage";
import {alt} from "../../../../main/shared/alt";
import {IRouter} from "simple-react-router";

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

    const checkExpectedActionsWhen = function(done: DoneCallback, action: () => void) {
        const spy = sandbox.dispatchSpy();
        const fetchVersions = sandbox.sinon.stub(reportStore, "fetchVersions").returns(Promise.resolve(null));
        const fetchVersionDetails = sandbox.sinon.stub(reportStore, "fetchVersionDetails").returns(Promise.resolve(null));

        action();

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, { action:  "ReportActions.setCurrentReport", payload: "reportname"}, 0);
            expect(fetchVersions.called).to.equal(true, "Expected fetchVersions to be called");
            afterWait(done, () => {
                expectOneAction(spy, { action:  "ReportActions.setCurrentVersion", payload: "versionname"}, 1);
                expect(fetchVersionDetails.called).to.equal(true, "Expected fetchVersionDetails to be called");
            });
        });
    };

    it("triggers actions on mount", (done: DoneCallback) => {
        checkExpectedActionsWhen(done, () => {
            const pageProps = mockLocation<VersionInfoPageProps>({report: "reportname", version: "versionname"});
            new VersionInfoPage({location: pageProps, router: null}).componentDidMount();
        });
    });

    it("triggers actions on load", (done: DoneCallback) => {
        checkExpectedActionsWhen(done, () => {
            VersionInfoPage.load("reportname", "versionname");
        });
    });

    it("triggers actions and redirect on changeVersion", (done: DoneCallback) => {
        const redirectTo = sandbox.sinon.stub();
        const router: IRouter = { redirectTo };

        checkExpectedActionsWhen(done, () => {
            VersionInfoPage.changeVersion("reportname", "versionname", router);
            expect(redirectTo.called).to.equal(true, "Expected redirectTo to be called");
            expect(redirectTo.calledWith("/reportname/versionname/"));
        });
    });
});