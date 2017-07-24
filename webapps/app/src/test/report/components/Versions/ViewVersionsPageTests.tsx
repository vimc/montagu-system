import * as React from "react";
import { expect } from "chai";
import { Sandbox } from "../../../Sandbox";
import { mockLocation } from "../../../mocks/mocks";
import { checkAsync } from "../../../testHelpers";
import {ViewVersionsPage, ViewVersionsPageProps} from "../../../../main/report/components/Versions/ViewVersionsPage";
import {reportStore} from "../../../../main/report/stores/ReportStore";
import {reportActions} from "../../../../main/report/actions/ReportActions";
import {expectOneAction} from "../../../actionHelpers";

describe("ViewVersionsPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers setCurrentReport on load", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchVersions = sandbox.sinon
            .stub(reportStore, "fetchVersions")
            .returns(Promise.resolve(null));

        const pageProps = mockLocation<ViewVersionsPageProps>({ name: "reportname" });
        sandbox.mount(<ViewVersionsPage location={pageProps} />);
        checkAsync(done, () => {
            expectOneAction(spy, {
                action: "ReportActions.setCurrentReport",
                payload: "reportname"
            });
        });
    });


    it("triggers fetchVersions on load", (done: DoneCallback) => {
        const fetchVersions = sandbox.sinon
            .stub(reportStore, "fetchVersions")
            .returns(Promise.resolve(null));

        const pageProps = mockLocation<ViewVersionsPageProps>({ name: "reportname" });
        sandbox.mount(<ViewVersionsPage location={pageProps} />);
        checkAsync(done, () => {
            expect(fetchVersions.called).to.equal(true);
        });
    });
});