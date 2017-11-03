import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {alt} from "../../../../main/shared/alt";
import {VersionDetailsComponent, VersionProps} from "../../../../main/report/components/Versions/VersionDetails";
import {mockVersion} from "../../../mocks/mockModels";
import {FileDownloadLink} from "../../../../main/report/components/FileDownloadLink";
import {mockRouter} from "../../../mocks/mockRouter";
import {Sandbox} from "../../../Sandbox";
import {ReportVersionSwitcher} from "../../../../main/report/components/Versions/ReportVersionSwitcher";

describe("VersionDetails", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("can get props from stores", () => {
        alt.bootstrap(JSON.stringify({
            ReportStore: {
                versionDetails: {"v1": mockVersion()},
                currentReport: "reportname",
                currentVersion: "v1",
                versions: {
                    reportname: ["v1", "v2", "v3"],
                    otherReport: ["v4", "v5", "v6"]
                },
                ready: true
            },
            ReportingAuthStore: {loggedIn: true}
        }));

        const onChangeVersion = sandbox.sinon.stub();
        const inputProps = { onChangeVersion };

        const expected: VersionProps = {
            report: "reportname",
            versionDetails: mockVersion(),
            ready: true,
            otherVersions: ["v1", "v2", "v3"],
            onChangeVersion: onChangeVersion
        };

        expect(VersionDetailsComponent.getPropsFromStores(inputProps)).to.eql(expected);
    });


    it("renders date", () => {
        const rendered = shallow(<VersionDetailsComponent
            versionDetails={mockVersion({date: "2015-03-25"})}
            report="reportname"
            otherVersions={[]}
            onChangeVersion={null}
            ready={true}
        />);
        expect(rendered.find('td').at(1).text()).to.eq("2015-03-25");
    });

    it("renders zip download link", () => {
        const rendered = shallow(<VersionDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            otherVersions={[]}
            onChangeVersion={null}
            ready={true}
        />);
        expect(rendered.find('td').at(0).find(FileDownloadLink).at(0).prop("href")).to.eq("/reports/reportname/v1/all/");
    });

    it("renders report version switcher", () => {
        const handler = sandbox.sinon.stub();
        const rendered = shallow(<VersionDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            otherVersions={["v1", "v2"]}
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
        const rendered = shallow(<VersionDetailsComponent
            versionDetails={mockVersion({id: "v1"})}
            report="reportname"
            otherVersions={["v1", "v2"]}
            onChangeVersion={handler}
            ready={true}
        />);
        rendered.find(ReportVersionSwitcher).simulate("changeVersion", "v3");
        expect(handler.calledWith("v3"));
    });
});