import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockCoverageSet } from "../../../mocks/mockModels";

import { CoverageSetComponent } from "../../../../main/contrib/components/Responsibilities/Coverage/CoverageSetComponent";

describe("CoverageSetComponent", () => {
    it("renders all metadata", () => {
        const set = mockCoverageSet({
            name: "my-name",
            vaccine: "my-vaccine",
            activity_type: "campaign",
            gavi_support: "no vaccine"
        });
        const rendered = shallow(<CoverageSetComponent order={ 0 } set={ set } />);
        const cells = rendered.find("td");
        const expectedCellContentsInOrder = [
            "my-name",
            "my-vaccine",
            "campaign",
            "no vaccine"
        ];
        expectedCellContentsInOrder.forEach((expected, i) => {
            expect(cells.at(i).text()).to.equal(expected);
        });
    });
});