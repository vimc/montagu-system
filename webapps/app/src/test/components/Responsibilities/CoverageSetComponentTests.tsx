import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockCoverageSet } from "../../mocks/mockModels";

import { CoverageSetComponent } from "../../../main/contrib/components/Responsibilities/Coverage/CoverageSetComponent";

describe("CoverageSetComponent", () => {
    it("renders all metadata", () => {
        const set = mockCoverageSet({
            name: "my-name",
            vaccine: "my-vaccine",
            activity_type: "campaign",
            gavi_support_level: "none"
        });
        const rendered = shallow(<CoverageSetComponent order={ 0 } set={ set } />);
        const cells = rendered.find("td");
        const expectedCellContentsInOrder = [
            "1",  // User-displayed order is 1-indexed
            "my-name",
            "my-vaccine",
            "campaign",
            "none"
        ];
        expectedCellContentsInOrder.forEach((expected, i) => {
            expect(cells.at(i).text()).to.equal(expected);
        });
    });
});