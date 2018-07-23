import {
    mockTouchstoneVersion,
    mockResponsibilitySetWithExpectations
} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockAdminState} from "../../../../mocks/mockStates";
import {ResponsibilityList} from
    "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityList";
import {ResponsibilitiesPage} from
    "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilitiesPage";
import {mockMatch} from "../../../../mocks/mocks";
import {Sandbox} from "../../../../Sandbox";
import {touchstoneResponsibilitiesPageActionCreators} from
    "../../../../../main/admin/actions/pages/TouchstoneResponsibilityPageActionCreators";

describe("ResponsibilitiesPage", () => {

    const mockResponsibilitySets = [mockResponsibilitySetWithExpectations(), mockResponsibilitySetWithExpectations()];

    let store = createMockAdminStore(mockAdminState({
        touchstones: {
            currentResponsibilitySets: mockResponsibilitySets,
            currentTouchstoneVersion: mockTouchstoneVersion()
        }
    }));

    const sandbox = new Sandbox();

    beforeEach(() => {
        sandbox.setStubReduxAction(touchstoneResponsibilitiesPageActionCreators, "onLoad")
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders responsibility list for each responsibility set", () => {

        const rendered = shallow(<ResponsibilitiesPage location={null} router={null} history={null}
                                                       match={mockMatch()}/>, {context: {store}})
            .dive();
        expect(rendered.find(ResponsibilityList)).to.have.lengthOf(2);

    });

    it("renders modelling group name and set status for each set", () => {

        const rendered = shallow(<ResponsibilitiesPage location={null} router={null} history={null}
                                                       match={mockMatch()}/>, {context: {store}})
            .dive();

        expect(rendered.find("h4").at(0).text()).to.eq("g1 (incomplete)");


    });

});