import {AnnotatedResponsibility} from "../../../../../main/admin/models/AnnotatedResponsibility";
import {mockModellingGroup, mockResponsibility} from "../../../../mocks/mockModels";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mount} from "enzyme";
import {ResponsibilityCommentModal} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityCommentModal";
import * as React from "react";

describe("ResponsibilityCommentModal", () => {

    it("renders modal", () => {
        const responsibility: AnnotatedResponsibility = {
            ...mockResponsibility(),
            modellingGroup: mockModellingGroup().id,
            comment: {
                comment: "Lorem ipsum",
                added_by: "test.user",
                added_on: "2017-07-13 13:55:29 +0100"
            }
        };
        const store = createMockAdminStore({
            touchstones: {
                currentTouchstoneVersion: {id: "touchstone-1"},
                currentResponsibility: responsibility
            }
        });
        const rendered = mount(<ResponsibilityCommentModal/>, {context: {store}});
        expect(rendered.find(".modal-title").at(0).text()).toEqual("Comment for touchstone-1, group-2, Description");
        expect(rendered.find(".modal-body textarea").at(0).props().value).toEqual("Lorem ipsum");
        expect(rendered.find(".modal-footer span").at(0).text()).toEqual("Last updated by test.user at 2017-07-13 13:55:29 +0100");
    })

});
