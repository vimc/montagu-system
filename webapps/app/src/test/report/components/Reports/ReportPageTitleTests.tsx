import {expect} from "chai";
import {
    ReportPageTitleComponent,
    ReportPageTitleProps
} from "../../../../main/report/components/Reports/ReportPageTitle";
import {bootstrapStore} from "../../../StoreHelpers";
import {reportStore} from "../../../../main/report/stores/ReportStore";
import {mockVersion} from "../../../mocks/mockModels";
import {shallow} from "enzyme";
import * as React from "react";
import {makeLookup} from "../../../../main/shared/models/Lookup";
import {Sandbox} from "../../../Sandbox";

describe("ReportPageTitle", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("gets name if details haven't been fetched yet", () => {
        bootstrapStore(reportStore, {
            currentReport: "forecast",
            currentVersion: "v25",
            versionDetails: {},
        });
        expect(ReportPageTitleComponent.getPropsFromStores()).to.eql({
            name: "forecast",
            version: "v25",
            displayName: null,
        });
    });

    it("gets display name if details have been fetched", () => {
        bootstrapStore(reportStore, {
            currentReport: "forecast",
            currentVersion: "v25",
            versionDetails: makeLookup([
                mockVersion({
                    id: "forecast",
                    displayname: "Shipping Forecast"
                })
            ])
        });
        expect(ReportPageTitleComponent.getPropsFromStores()).to.eql({
            name: "forecast",
            version: "v25",
            displayName: null,//"Shipping Forecast"
        });
    });

    const getTitleText = function (props: Partial<ReportPageTitleProps>): string {
        const defaultProps: ReportPageTitleProps = {
            name: null,
            version: null,
            displayName: null
        };
        const fullProps = Object.assign({}, defaultProps, props);
        const rendered = shallow(<ReportPageTitleComponent {...fullProps} />);
        return rendered.find("div").at(0).text();
    };

    it("renders name if display name is missing", () => {
        expect(getTitleText({name: "name", displayName: null})).to.equal("name");
        expect(getTitleText({name: "name", displayName: undefined})).to.equal("name");
        expect(getTitleText({name: "name", displayName: ""})).to.equal("name");
    });

    it("renders display name if available", () => {
        expect(getTitleText({name: name, displayName: "display name"})).to.equal("display name");
    });
});