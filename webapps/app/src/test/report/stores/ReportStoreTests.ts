import {alt} from "../../../main/shared/alt";
import {expect} from "chai";
import {reportActions} from "../../../main/report/actions/ReportActions";
import {reportStore} from "../../../main/report/stores/ReportStore";
import { mockReport, mockVersion } from "../../mocks/mockModels";

describe("ReportStore", () => {
    beforeEach(() => alt.recycle());

    it("has current report after reportActions.setCurrentReport", () => {
        reportActions.setCurrentReport("reportname");
        expect(reportStore.getState().currentReport).to.eql("reportname");
    });

    it("has versions after reportActions.updateVersions", () => {
        reportActions.setCurrentReport("reportname");
        reportActions.updateVersions(["version1", "version2"]);

        expect(reportStore.getState().versions).to.eql({"reportname": ["version1", "version2"]});
        expect(reportStore.getState().ready).to.be.true;
    });

    it("versions is blank after reportActions.beginFetchVersions", () => {
        reportActions.setCurrentReport("reportname");
        reportActions.updateVersions(["version1", "version2"]);
        reportActions.beginFetchVersions();

        expect(reportStore.getState().versions).to.eql({});
        expect(reportStore.getState().ready).to.be.false;
    });

    it("has version details after reportActions.updateVersionDetails", () => {
        reportActions.setCurrentVersion("versionname");
        reportActions.updateVersionDetails(mockVersion());

        expect(reportStore.getState().versionDetails).to.eql({"versionname": mockVersion()});
        expect(reportStore.getState().ready).to.be.true;
    });

    it("versions is blank after reportActions.beginFetchVersionDetails", () => {
        reportActions.setCurrentVersion("versionname");
        reportActions.updateVersionDetails(mockVersion());
        reportActions.beginFetchVersionDetails();

        expect(reportStore.getState().versionDetails).to.eql({});
        expect(reportStore.getState().ready).to.be.false;
    });
});