import {mockResponsibilitySetWithExpectations} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import * as React from "react";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockAdminState} from "../../../../mocks/mockStates";
import {ResponsibilitiesPage} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilitiesPage";
import {mockMatch} from "../../../../mocks/mocks";
import {Sandbox} from "../../../../Sandbox";
import {touchstoneResponsibilitiesPageActionCreators} from "../../../../../main/admin/actions/pages/TouchstoneResponsibilityPageActionCreators";
import {ResponsibilitySet} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilitySet";
import {FileDownloadButton} from "../../../../../main/shared/components/FileDownloadLink";

describe("ResponsibilitiesPage", () => {

    const mockResponsibilitySets = [
        mockResponsibilitySetWithExpectations({modelling_group_id: "g1"}),
        mockResponsibilitySetWithExpectations({modelling_group_id: "g2"})
    ];

    let store = createMockAdminStore(mockAdminState({
        touchstones: {
            currentResponsibilitySets: mockResponsibilitySets,
            currentResponsibilityComments: mockResponsibilitySets.map(rs => ({
                modelling_group_id: rs.modelling_group_id,
                responsibilities: rs.responsibilities.map(r => ({
                    scenario_id: r.scenario.id,
                }))
            })),
            currentTouchstoneVersion: {
                id: "v1"
            }
        },
        auth: {
            canReviewResponsibilities: true
        }
    }));

    const sandbox = new Sandbox();

    beforeEach(() => {
        sandbox.setStubReduxAction(touchstoneResponsibilitiesPageActionCreators, "onLoad")
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders responsibility set for each responsibility set", () => {

        const rendered = shallow(<ResponsibilitiesPage location={null} router={null} history={null}
                                                       match={mockMatch()}/>, {context: {store}}).dive().dive();
        expect(rendered.find(FileDownloadButton)).toHaveLength(1);
        expect(rendered.find(FileDownloadButton).props().href).toEqual("/touchstones/v1/responsibilities/csv/");
        expect(rendered.find(ResponsibilitySet)).toHaveLength(2);
    });

});