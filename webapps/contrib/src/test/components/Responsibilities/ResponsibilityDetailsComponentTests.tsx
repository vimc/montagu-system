import * as React from "react";
import { expect } from "chai";
import { mockCoverageSet, mockScenario, mockTouchstone } from "../../mocks/mockModels";
import { shallow } from "enzyme";

import {
    ResponsibilityDetailsComponent,
    ResponsibilityDetailsProps
} from "../../../main/components/Responsibilities/Details/ResponsibilityDetails"
import { findLabelledCell } from "../../TableHelpers";
import { CoverageSetList } from "../../../main/components/Responsibilities/Details/CoverageSetList";

describe("ResponsibilityDetailsComponent", () => {
    it("renders the general metadata", () => {
        const touchstone = mockTouchstone();
        const scenario = mockScenario();
        const props: ResponsibilityDetailsProps = {
            ready: true,
            touchstone,
            scenario,
            coverageSets: []
        };
        const rendered = shallow(<ResponsibilityDetailsComponent {...props} />);
        expect(findLabelledCell(rendered, "Touchstone").text()).to.equal(touchstone.description);
        expect(findLabelledCell(rendered, "Scenario").text()).to.equal(scenario.description);
    });

    it("renders coverage set list", () => {
        const sets = [ mockCoverageSet(), mockCoverageSet() ];
        const props: ResponsibilityDetailsProps = {
            ready: true,
            touchstone: mockTouchstone(),
            scenario: mockScenario(),
            coverageSets: sets
        };
        const rendered = shallow(<ResponsibilityDetailsComponent {...props} />);
        expect(rendered.find(CoverageSetList).props()).to.eql({ coverageSets: sets });
    });
});