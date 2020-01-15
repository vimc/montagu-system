import {mockBurdenEstimateSet, mockResponsibility} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {ResponsibilityListItem} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityList";

describe("ResponsibilityListItem", () => {

    test("renders responsibility with no estimate set", () => {
        const r = mockResponsibility();
        const rendered = shallow(<ResponsibilityListItem {...r}/>);
        const cells = rendered.find("td");
        expect(cells).to.have.lengthOf(4);
        expect(cells.at(0).text()).to.eq(r.scenario.description);
        expect(cells.at(1).text()).to.eq(r.scenario.disease);
        expect(cells.at(2).text()).to.eq(r.status);
        expect(cells.at(3).text()).to.eq("None");
    });

    test("renders date of last estimate set", () => {
        const r = mockResponsibility({current_estimate_set:
                mockBurdenEstimateSet({uploaded_on: "2017-07-13 13:55:29 +0100"})});
        const rendered = shallow(<ResponsibilityListItem {...r}/>);
        expect(rendered.find("td").last().text()).to.eq("2017-07-13 13:55:29 +0100");
    });

});