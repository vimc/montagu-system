import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import {mockReport} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {
    latestVersionAccessorFunction,
    LatestVersionCell
} from "../../../../../main/report/components/ReportsList/ReportListColumns/VersionColumn";

describe("ReportListComponent", () => {

    const sandbox = new Sandbox();

    beforeEach(function () {
        sandbox.restore();
    });


    describe("LatestVersionColumn", () => {

        it("creates data object with id and last updated date", function () {

            const now = new Date("2018-05-14T23:00:00.000Z");
            const result = latestVersionAccessorFunction(mockReport({
                latest_version: "1234",
                updated_on: now.toDateString()
            }));

            expect(result).to.eql({version: "1234", date: new Date("2018-05-14T23:00:00.000Z")});
        });

        it("renders version id and date", function () {
            const result = shallow(<LatestVersionCell original={mockReport({display_name: null})}
                                                      value={{
                                                          version: "46324",
                                                          date: new Date("2018-05-14T23:00:00.000Z")
                                                      }}/>);

            expect(result.find(".small").childAt(0).text()).to.eq("46324");
            expect(result.find(".small").childAt(1).text()).to.eq("(Tue May 15 2018)");
        });

    });


});