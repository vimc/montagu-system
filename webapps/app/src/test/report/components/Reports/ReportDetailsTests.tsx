import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {alt} from "../../../../main/shared/alt";
import {mockVersion} from "../../../mocks/mockModels";
import {FileDownloadLink} from "../../../../main/report/components/FileDownloadLink";
import {Sandbox} from "../../../Sandbox";
import {ReportStoreState} from "../../../../main/report/stores/ReportStore";
import {ReportDetailsComponent, ReportDetailsProps} from "../../../../main/report/components/Reports/ReportDetails";
import {ReportVersionSwitcher} from "../../../../main/report/components/Reports/ReportVersionSwitcher";

describe("ReportDetails", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    describe("getPropsFromStores", () => {
        const setupStore = function (extraState?: Partial<ReportStoreState>) {
            const state = Object.assign({
                versionDetails: {"v1": mockVersion()},
                currentReport: "reportname",
                currentVersion: "v1",
                versions: {
                    reportname: ["v1", "v2", "v3"],
                    otherReport: ["v4", "v5", "v6"]
                },
                ready: true
            }, extraState);

            alt.bootstrap(JSON.stringify({
                ReportStore: state,
                ReportingAuthStore: {loggedIn: true}
            }));
        };

        const assertIsNotReady = function() {
            expect(ReportDetailsComponent.getPropsFromStores({}).ready).to.equal(false);
        };

        it("is ready when state is correct", () => {
            setupStore();
            const onChangeVersion = sandbox.sinon.stub();
            const inputProps = {onChangeVersion};

            const expected: ReportDetailsProps = {
                report: "reportname",
                versionDetails: mockVersion(),
                ready: true,
                allVersions: ["v1", "v2", "v3"],
                onChangeVersion: onChangeVersion
            };
            expect(ReportDetailsComponent.getPropsFromStores(inputProps)).to.eql(expected);
        });

        it("is not ready if store is not ready", () => {
            setupStore({ready: false});
            assertIsNotReady();
        });

        it("is not ready if versions have not been fetched", () => {
            setupStore({versions: {}});
            assertIsNotReady();
        });

        it("is not ready if version details have not been fetched", () => {
            setupStore({versionDetails: {}});
            assertIsNotReady();
        });
    });

    it("renders date", () => {
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({date: "2015-03-25"})}
            report="reportname"
            allVersions={[]}
            onChangeVersion={null}
            ready={true}
        />);
        expect(rendered.find('td').at(1).text()).to.eq("2015-03-25");
    });

    it("renders zip download link", () => {
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            allVersions={[]}
            onChangeVersion={null}
            ready={true}
        />);
        expect(rendered.find('td').at(0).find(FileDownloadLink).at(0).prop("href")).to.eq("/reports/reportname/versions/v1/all/");
    });

    it("renders report version switcher", () => {
        const handler = sandbox.sinon.stub();
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            allVersions={["v1", "v2"]}
            onChangeVersion={handler}
            ready={true}
        />);
        expect(rendered.find(ReportVersionSwitcher).props()).to.eql({
            currentVersion: "v1",
            versions: ["v1", "v2"],
            onChangeVersion: handler
        });
    });

    it("emits onChangeVersion when switcher triggers it", () => {
        const handler = sandbox.sinon.stub();
        const rendered = shallow(<ReportDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            allVersions={["v1", "v2"]}
            onChangeVersion={handler}
            ready={true}
        />);
        rendered.find(ReportVersionSwitcher).simulate("changeVersion", "v3");
        expect(handler.calledWith("v3"));
    });
});