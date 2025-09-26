import {mockModellingGroup, mockResponsibility} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import * as React from "react";
import {ResponsibilityList} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityList";
import {createMockAdminStore} from "../../../../mocks/mockStore";

describe("ResponsibilityList", () => {

    it("renders headers without permission to view comments", () => {
        const r = [
            {
                modellingGroup: mockModellingGroup().id,
                ...mockResponsibility()
            }
        ];
        const store = createMockAdminStore();
        const rendered = shallow(<ResponsibilityList responsibilities={r}/>, {context: {store}}).dive();
        const cells = rendered.find("th");
        expect(cells).toHaveLength(4);
        expect(cells.at(0).text()).toEqual("Scenario");
        expect(cells.at(1).text()).toEqual("Disease");
        expect(cells.at(2).text()).toEqual("Status");
        expect(cells.at(3).text()).toEqual("Latest estimate set");
    });

    it("renders headers with permission to view comments", () => {
        const r = [
            {
                modellingGroup: mockModellingGroup().id,
                ...mockResponsibility()
            }
        ];
        const store = createMockAdminStore({auth: {canReviewResponsibilities: true}});
        const rendered = shallow(<ResponsibilityList responsibilities={r}/>, {context: {store}}).dive();
        const cells = rendered.find("th");
        expect(cells).toHaveLength(5);
        expect(cells.at(0).text()).toEqual("Scenario");
        expect(cells.at(1).text()).toEqual("Disease");
        expect(cells.at(2).text()).toEqual("Status");
        expect(cells.at(3).text()).toEqual("Latest estimate set");
        expect(cells.at(4).text()).toEqual("Comment");
    });

});