import {
    mockTouchstoneVersion,
    mockResponsibilitySet
} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockAdminState} from "../../../../mocks/mockStates";
import {ResponsibilityList} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityList";
import {TouchstoneVersionPage} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {mockMatch} from "../../../../mocks/mocks";
import {Sandbox} from "../../../../Sandbox";
import {touchstoneVersionPageActionCreators} from "../../../../../main/admin/actions/pages/TouchstoneVersionPageActionCreators";

describe("TouchstoneVersionPage", () => {

    const mockResponsibilitySets = [mockResponsibilitySet(), mockResponsibilitySet()];

    let store = createMockAdminStore(mockAdminState({
        touchstones: {
            currentResponsibilitySets: mockResponsibilitySets,
            currentTouchstoneVersion: mockTouchstoneVersion()
        }
    }));

    const sandbox = new Sandbox();

    beforeEach(() => {
        sandbox.setStubReduxAction(touchstoneVersionPageActionCreators, "onLoad")
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders responsibility list for each responsibility set", () => {

        const rendered = shallow(<TouchstoneVersionPage location={null} router={null} history={null}
                                                         match={mockMatch()}/>, {context: {store}})
            .dive();
        expect(rendered.find(ResponsibilityList)).to.have.lengthOf(2);

    });

    it("renders modelling group name and set status for each set", () => {

        const rendered = shallow(<TouchstoneVersionPage location={null} router={null} history={null}
                                                        match={mockMatch()}/>, {context: {store}})
            .dive();

        expect(rendered.find("h4").at(0).text()).to.eq("g1 (incomplete)");


    });

});