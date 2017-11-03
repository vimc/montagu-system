import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {ReportListItem} from "../../../main/report/components/Reports/ReportListItem";
import {Report} from "../../../main/shared/models/Generated";
import {InternalLink} from "../../../main/shared/components/InternalLink";

interface LinkProps {
    url: string;
    text: string;
}

describe("ReportListItem", () => {
    const render = function(props: Partial<Report>): LinkProps {
        const defaultProps: Report = {
            name: "name",
            display_name: "display name",
            latest_version: null
        };
        const combined: Report = Object.assign({}, defaultProps, props);
        const rendered = shallow(<ReportListItem {...combined} />);
        const link = rendered.find(InternalLink);
        return {
            url: link.prop("href"),
            text: link.children().text()
        };
    };


    it("renders display name if possible", () => {
        expect(render({ display_name: "display name" }).text)
            .to.equal("display name");
    });

    it("renders short name if display name is empty", () => {
        expect(render({ name: "name", display_name: "" }).text)
            .to.equal("name");
    });

    it("renders short name if display name is null", () => {
        expect(render({ name: "name", display_name: null }).text)
            .to.equal("name");
    });

    it("links to latest report version", () => {
        expect(render({ name: "name", latest_version: "some_version" }).url)
            .to.equal("/name/some_version/");
    });
});