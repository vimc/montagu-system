import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {ReportListItem} from "../../../main/report/components/Reports/ReportListItem";
import {Report} from "../../../main/shared/models/Generated";
import {InternalLink} from "../../../main/shared/components/InternalLink";


describe("ReportListItem", () => {
    const render = function(props: Partial<Report>): string {
        const defaultProps: Report = {
            name: "name",
            display_name: "display name",
            latest_version: null
        };
        const combined: Report = Object.assign({}, defaultProps, props);
        const rendered = shallow(<ReportListItem {...combined} />);
        return rendered.find(InternalLink).children().text();
    };


    it("renders display name if possible", () => {
        expect(render({ display_name: "display name" }))
            .to.equal("display name");
    });

    it("renders short name if display name is empty", () => {
        expect(render({ name: "name", display_name: "" }))
            .to.equal("name");
    });

    it("renders short name if display name is null", () => {
        expect(render({ name: "name", display_name: null }))
            .to.equal("name");
    });
});