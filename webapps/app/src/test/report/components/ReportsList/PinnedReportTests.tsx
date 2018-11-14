import * as React from "react";
import {expect} from "chai";

import "../../../helper";
import {mockReportAppState, mockReportsState} from "../../../mocks/mockStates";
import {Sandbox} from "../../../Sandbox";
import {
    mapStateToProps,
    PinnedReports,
    PinnedReportsComponent
} from "../../../../main/report/components/ReportsList/PinnedReports";
import {mockReport} from "../../../mocks/mockModels";
import {shallow} from "enzyme";
import {createMockReportStore} from "../../../mocks/mockStore";
import {Card, CardHeader} from "reactstrap";
import {FileDownloadButton} from "../../../../main/shared/components/FileDownloadLink";
import {InternalLink} from "../../../../main/shared/components/InternalLink";

describe("PinnedReports", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const stateWithNoMatchingReports = mockReportAppState({ reports: mockReportsState({
            reports: [mockReport({name: "else", published: true, id: "1"}),
                mockReport({name: "other", published: false, id: "1"})]
        })});

    const stateWithMatchingReports = mockReportAppState({
        reports: {reports: [mockReport({name: "else", published: true, id: "1"}),
                mockReport({name: "other", published: false, id: "1"}),
                mockReport({name: "other", published: true, id: "1"}),
                mockReport({name: "other", published: true, id: "2"})]
        }});

    it("gets first published version of reports in settings.pinnedReports", () => {

        const props = mapStateToProps(stateWithMatchingReports);
        expect(props.reports).to.have.lengthOf(1);
        expect(props.reports[0].id).to.eq("1");
        expect(props.reports[0].published).to.be.true;
    });

    it("can handle no reports", () => {

        const props = mapStateToProps(stateWithNoMatchingReports);
        expect(props.reports).to.have.lengthOf(0);
    });

    it("renders reports if there are matching reports", () => {

        const store = createMockReportStore(stateWithMatchingReports);

        const rendered = shallow(<PinnedReports/>, {context : {store}})
            .dive().dive();

        expect(rendered.find(Card)).to.have.lengthOf(1);
    });

    it("renders nothing if there are no matching reports", () => {

        const store = createMockReportStore(stateWithNoMatchingReports);

        const rendered = shallow(<PinnedReports/>, {context : {store}})
            .dive().dive();

        expect(rendered.find("div")).to.have.lengthOf(0);
    });


    it("pinned report contains link to download zip", () => {

        const store = createMockReportStore(stateWithMatchingReports);

        const rendered = shallow(<PinnedReports/>, {context : {store}})
            .dive().dive();

        const downloadLink = rendered.find(Card).find(FileDownloadButton);
        expect(downloadLink.prop("href")).to.eq("/reports/other/versions/1/all/");
        expect(downloadLink.prop("service")).to.eq("reporting");

    });

    it("pinned report contains link to report page", () => {

        const store = createMockReportStore(stateWithMatchingReports);

        const rendered = shallow(<PinnedReports/>, {context : {store}})
            .dive().dive();

        const card = rendered.find(Card);
        expect(card.find(InternalLink).prop("href")).to.eq("/other/1/")

    });


});

