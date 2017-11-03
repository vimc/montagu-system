import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Sandbox} from "../../../Sandbox";
import {mockLocation} from "../../../mocks/mocks";
import {checkAsync} from "../../../testHelpers";
import {reportStore} from "../../../../main/report/stores/ReportStore";
import {expectOneAction} from "../../../actionHelpers";
import {VersionInfoPage, VersionInfoPageProps} from "../../../../main/report/components/Versions/VersionInfoPage";
import {alt} from "../../../../main/shared/alt";
import {IRouter} from "simple-react-router";
import {VersionDetails} from "../../../../main/report/components/Versions/VersionDetails";

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

    const checkExpectedActionsWhen = function (done: DoneCallback, action: () => void) {
        const spy = sandbox.dispatchSpy();
        const fetchVersions = sandbox.sinon.stub(reportStore, "fetchVersions").returns(Promise.resolve(null));
        const fetchVersionDetails = sandbox.sinon.stub(reportStore, "fetchVersionDetails").returns(Promise.resolve(null));

        action();

        checkAsync(done, (afterWait) => {
            expectOneAction(spy, {action: "ReportActions.setCurrentReport", payload: "reportname"}, 0);
            expect(fetchVersions.called).to.equal(true, "Expected fetchVersions to be called");
            afterWait(done, () => {
                expectOneAction(spy, {action: "ReportActions.setCurrentVersion", payload: "versionname"}, 1);
                expect(fetchVersionDetails.called).to.equal(true, "Expected fetchVersionDetails to be called");
            });
        });
    };

    it("triggers actions on mount", (done: DoneCallback) => {
        checkExpectedActionsWhen(done, () => {
            const location = mockLocation<VersionInfoPageProps>({report: "reportname", version: "versionname"});
            new VersionInfoPage({location: location, router: null}).componentDidMount();
        });
    });

    it("triggers actions and redirect when child triggers changeVersion", (done: DoneCallback) => {
        const redirectTo = sandbox.sinon.stub();
        const router: IRouter = {redirectTo};

        checkExpectedActionsWhen(done, () => {
            const location = mockLocation<VersionInfoPageProps>({report: "reportname", version: "oldVersion"});
            const rendered = shallow(<VersionInfoPage location={location} router={router} />);
            rendered.find(VersionDetails).simulate("changeVersion", "versionname");
            expect(redirectTo.called).to.equal(true, "Expected redirectTo to be called");
            expect(redirectTo.calledWith("/reportname/versionname/"));
        });
    });
});