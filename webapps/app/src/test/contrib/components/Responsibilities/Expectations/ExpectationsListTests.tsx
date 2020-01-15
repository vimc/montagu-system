import {ResponsibilitiesState} from "../../../../../main/contrib/reducers/responsibilitiesReducer";
import {
    mockExpectationMapping,
    mockExtendedResponsibilitySet,
    mockModellingGroup,
    mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {
    ExpectationsList,
    mapStateToProps
} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsList";
import {createMockContribStore} from "../../../../mocks/mockStore";
import * as React from "react";
import {expect} from "chai";
import {ExpectationsDescription} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsDescription";
import {ExpectationMapping} from "../../../../../main/shared/models/Generated";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {mockContribState} from "../../../../mocks/mockStates";
import {ModellingGroupsState} from "../../../../../main/contrib/reducers/modellingGroupsReducer";
import {TouchstonesState} from "../../../../../main/contrib/reducers/contribTouchstonesReducer";

describe("ExpectationsList", () => {
    const currentUserGroup = mockModellingGroup();
    const currentTouchstoneVersion = mockTouchstoneVersion();
    const responsibilitiesSet = mockExtendedResponsibilitySet();

    const groups: Partial<ModellingGroupsState> = {currentUserGroup};
    const touchstones: Partial<TouchstonesState> = {currentTouchstoneVersion};
    const responsibilities: Partial<ResponsibilitiesState> = {responsibilitiesSet};

    test(
        "renders one ExpectationsDescription for each expectation mapping in the responsibility set",
        () => {
            const expectations: Array<ExpectationMapping> = [
                mockExpectationMapping(),
                mockExpectationMapping(),
                mockExpectationMapping(),
            ];
            const responsibilitiesState: Partial<ResponsibilitiesState> = {
                responsibilitiesSet: mockExtendedResponsibilitySet({expectations})
            };
            const store = createMockContribStore({
                responsibilities: responsibilitiesState,
                groups, touchstones
            });
            const rendered = shallow(<ExpectationsList/>, {context: {store}}).dive().dive();
            expect(rendered.find(ExpectationsDescription)).to.have.length(3);
        }
    );

    test("renders loading element if responsibilitiesSet is null", () => {
        const responsibilitiesState: Partial<ResponsibilitiesState> = {
            responsibilitiesSet: null
        };
        const store = createMockContribStore({
            responsibilities: responsibilitiesState,
            groups, touchstones
        });
        const rendered = shallow(<ExpectationsList/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement)).to.have.length(1);
    });

    test("maps state to props correctly", () => {
        const state = mockContribState({groups, touchstones, responsibilities});
        expect(mapStateToProps(state)).to.eql({
            responsibilitySet: responsibilitiesSet,
            group: currentUserGroup,
            touchstoneVersion: currentTouchstoneVersion
        });
    });
});