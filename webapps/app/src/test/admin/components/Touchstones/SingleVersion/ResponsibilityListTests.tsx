import {mockResponsibility} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {ResponsibilityList} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityList";

describe("ResponsibilityList", () => {

    it("renders headers", () => {
        const r = [mockResponsibility()];
        const rendered = shallow(<ResponsibilityList responsibilities={r}/>);
        const cells = rendered.find("th");
        expect(cells).to.have.lengthOf(4);
        expect(cells.at(0).text()).to.eq("Scenario");
        expect(cells.at(1).text()).to.eq("Disease");
        expect(cells.at(2).text()).to.eq("Status");
        expect(cells.at(3).text()).to.eq("Latest estimate set");
    });

});