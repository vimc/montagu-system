import {ResponsibilitiesState} from "../../../../../main/contrib/reducers/responsibilitiesReducer";
import {mockExpectationMapping, mockExtendedResponsibilitySet} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {ExpectationsList} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsList";
import {createMockContribStore} from "../../../../mocks/mockStore";
import * as React from "react";
import {expect} from "chai";
import {ExpectationsDescription} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsDescription";
import {ExpectationMapping} from "../../../../../main/shared/models/Generated";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";

describe("ExpectationsList", function () {
    it("renders one ExpectationsDescription for each expectation mapping in the responsibility set", () => {
        const expectations: Array<ExpectationMapping> = [
            mockExpectationMapping(),
            mockExpectationMapping(),
            mockExpectationMapping(),
        ];
        const responsibilitiesState: Partial<ResponsibilitiesState> = {
            responsibilitiesSet: mockExtendedResponsibilitySet({expectations})
        };
        const store = createMockContribStore({
            responsibilities: responsibilitiesState
        });
        const rendered = shallow(<ExpectationsList/>, {context: {store}}).dive().dive();
        expect(rendered.find(ExpectationsDescription)).to.have.length(3);
    });

    it("renders loading element if responsibilitiesSet is null", () => {
        const responsibilitiesState: Partial<ResponsibilitiesState> = {
            responsibilitiesSet: null
        };
        const store = createMockContribStore({
            responsibilities: responsibilitiesState
        });
        const rendered = shallow(<ExpectationsList/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement)).to.have.length(1);
    });
});