import {mockBurdenEstimateSet, mockModellingGroup, mockResponsibility} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";

import * as React from "react";
import {ResponsibilityListItem} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityListItem";
import {AnnotatedResponsibility} from "../../../../../main/admin/models/AnnotatedResponsibility";

describe("ResponsibilityListItem", () => {

    it("renders responsibility with no estimate set", () => {
        const r: AnnotatedResponsibility = {
            modellingGroup: mockModellingGroup().id,
            comment: {
                comment: "Lorem ipsum",
                added_by: "test.user",
                added_on: "2017-07-13 13:55:29 +0100"
            },
            ...mockResponsibility()
        };
        const rendered = shallow(<ResponsibilityListItem responsibility={r} selectResponsibility={jest.fn()}/>);
        const cells = rendered.find("td");
        expect(cells).toHaveLength(5);
        expect(cells.at(0).text()).toEqual(r.scenario.description);
        expect(cells.at(1).text()).toEqual(r.scenario.disease);
        expect(cells.at(2).text()).toEqual(r.status);
        expect(cells.at(3).text()).toEqual("None");
        expect(cells.at(4).text()).toContain("Lorem ipsum");
    });

    it("renders date of last estimate set", () => {
        const r: AnnotatedResponsibility = {
            modellingGroup: mockModellingGroup().id,
            ...mockResponsibility({
                current_estimate_set: mockBurdenEstimateSet({uploaded_on: "2017-07-13 13:55:29 +0100"})
            })
        };
        const rendered = shallow(<ResponsibilityListItem responsibility={r} selectResponsibility={jest.fn()}/>);
        expect(rendered.find("td").at(3).text()).toEqual("2017-07-13 13:55:29 +0100");
    });

});