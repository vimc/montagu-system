import {mockResponsibilitySetWithExpectations} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import * as React from "react";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockEvent} from "../../../../mocks/mocks";
import {ResponsibilitySet} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilitySet";
import {ResponsibilityList} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityList";

describe("ResponsibilitySet", () => {

    const responsibilitySet = mockResponsibilitySetWithExpectations({modelling_group_id: "g1"});
    const annotatedResponsibilitySet = {
        ...responsibilitySet,
        responsibilities: responsibilitySet.responsibilities.map(r => ({
            modellingGroup: responsibilitySet.modelling_group_id,
            ...r
        })),
        comment: {
            comment: "Lorem ipsum",
            added_by: "test.user",
            added_on: "2021-06-17T08:58:32.233Z"
        }
    };

    it("renders responsibility list for each responsibility set", () => {
        const store = createMockAdminStore();
        const rendered = shallow(<ResponsibilitySet responsibilitySet={annotatedResponsibilitySet}/>,
            {context: {store}}).dive();
        expect(rendered.find(ResponsibilityList)).toHaveLength(1);
    });

    it("renders modelling group name and set status for each set", () => {
        const store = createMockAdminStore();
        const rendered = shallow(<ResponsibilitySet responsibilitySet={annotatedResponsibilitySet}/>,
            {context: {store}}).dive();
        expect(rendered.find("h4").at(0).text()).toEqual("g1 (incomplete)");
    });

    it("does not render comment without relevant permission", () => {
        const store = createMockAdminStore();
        const rendered = shallow(<ResponsibilitySet responsibilitySet={annotatedResponsibilitySet}/>,
            {context: {store}}).dive();
        expect(rendered.find("div div").length).toBe(0);
    });

    it("renders comment and tooltip with relevant permission", () => {
        const store = createMockAdminStore({auth: {canReviewResponsibilities: true}});
        const rendered = shallow(<ResponsibilitySet responsibilitySet={annotatedResponsibilitySet}/>,
            {context: {store}}).dive();
        const container = rendered.find("div div").at(0);
        expect(container.find("span").at(1).text()).toEqual("Lorem ipsum");
        expect(container.find("span").at(1).prop("title")).toEqual("Lorem ipsum");
        expect(container.find("span").at(2).text()).toEqual("Edit");
    });

    it("fires action when comment edit link clicked", () => {
        const store = createMockAdminStore({auth: {canReviewResponsibilities: true}});
        const rendered = shallow(<ResponsibilitySet responsibilitySet={annotatedResponsibilitySet}/>,
            {context: {store}}).dive();
        const container = rendered.find("div div").at(0);
        container.find("a").simulate("click", mockEvent());
        expect(store.getActions()[0]).toEqual({
            type: "SET_CURRENT_TOUCHSTONE_RESPONSIBILITY_SET",
            data: annotatedResponsibilitySet
        });
    });

});