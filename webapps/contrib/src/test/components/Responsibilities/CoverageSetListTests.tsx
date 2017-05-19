import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { CoverageSetList } from "../../../main/components/Responsibilities/Details/CoverageSetList";
import { mockCoverageSet } from "../../mocks/mockModels";
import { CoverageSetComponent } from "../../../main/components/Responsibilities/Details/CoverageSetComponent";

describe("CoverageSetList", () => {
    it("renders one coverage set per line item", () => {
        const sets = [ mockCoverageSet(), mockCoverageSet() ];
        const rendered = shallow(<CoverageSetList coverageSets={ sets } />);
        expect(rendered.find(CoverageSetComponent)).to.have.length(2);
    });
});