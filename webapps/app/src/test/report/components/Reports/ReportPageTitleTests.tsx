import {expect} from "chai";
import {ReportPageTitleComponent} from "../../../../main/report/components/Reports/ReportPageTitle";
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
            versionDetails: {}
        });
        expect(ReportPageTitleComponent.getPropsFromStores()).to.eql({
            name: "forecast",
            displayName: null
        });
    });

    it("gets display name if details have been fetched", () => {
        bootstrapStore(reportStore, {
            currentReport: "forecast",
            versionDetails: makeLookup([
                mockVersion({
                    id: "forecast",
                    displayname: "Shipping Forecast"
                })
            ])
        });
        expect(ReportPageTitleComponent.getPropsFromStores()).to.eql({
            name: "forecast",
            displayName: "Shipping Forecast"
        });
    });

    it("renders name if display name is missing", () => {
        expect(shallow(<ReportPageTitleComponent name="name" displayName={null}/>).text()).to.equal("name");
        expect(shallow(<ReportPageTitleComponent name="name" displayName={undefined}/>).text()).to.equal("name");
        expect(shallow(<ReportPageTitleComponent name="name" displayName={""}/>).text()).to.equal("name");
    });

    it("renders display name if available", () => {
        expect(shallow(<ReportPageTitleComponent name="name"
                                                 displayName="display name"/>).text()).to.equal("display name");
    });
});