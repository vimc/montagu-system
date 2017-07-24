import * as React from "react";
import { shallow} from "enzyme";
import {expect} from "chai";
import { alt } from "../../../../main/shared/alt";
import {
    VersionList, VersionListComponent,
    VersionListProps
} from "../../../../main/report/components/Versions/VersionList";
import {VersionListItem} from "../../../../main/report/components/Versions/VersionListItem";

describe("VersionList", () => {

    it("can get props from stores", () => {
        alt.bootstrap(JSON.stringify({
            ReportStore: {
                versions: {"reportname": ["a", "b"]},
                currentReport: "reportname"
            },
            ReportingAuthStore: { loggedIn: true }
        }));

        const expected: VersionListProps = {
            versions: ["a", "b"],
            report: "reportname",
            ready: true
        };

        expect(VersionListComponent.getPropsFromStores()).to.eql(expected);
    });


    it("can render", () => {

        const rendered = shallow(<VersionListComponent versions={["a", "b"]} report="reportname" ready={true} />);

        expect(rendered.find('VersionListItem').length).to.eq(2);
        expect(rendered.children().at(0).prop('version')).to.eq("a");
        expect(rendered.children().at(0).prop('report')).to.eq("reportname");
        expect(rendered.children().at(0).key()).to.eq("a");

    });

});