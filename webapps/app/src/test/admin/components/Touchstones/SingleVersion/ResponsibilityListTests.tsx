import {mockResponsibility} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import * as React from "react";
import {ResponsibilityList} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityList";

describe("ResponsibilityList", () => {

    it("renders headers", () => {
        const r = [mockResponsibility()];
        const rendered = shallow(<ResponsibilityList responsibilities={r}/>);
        const cells = rendered.find("th");
        expect(cells).toHaveLength(4);
        expect(cells.at(0).text()).toEqual("Scenario");
        expect(cells.at(1).text()).toEqual("Disease");
        expect(cells.at(2).text()).toEqual("Status");
        expect(cells.at(3).text()).toEqual("Latest estimate set");
    });

});