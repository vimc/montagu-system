import {mockAnnotatedResponsibilitySet, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mount} from "enzyme";
import {
    ResponsibilitySetCommentModal,
    ResponsibilitySetCommentModalComponent
} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilitySetCommentModal";
import * as React from "react";
import {mockEvent} from "../../../../mocks/mocks";

describe("ResponsibilitySetCommentModal", () => {

    it("renders modal", () => {
        const store = createMockAdminStore({
            touchstones: {
                currentTouchstoneVersion: mockTouchstoneVersion(),
                currentResponsibilitySet: mockAnnotatedResponsibilitySet()
            }
        });
        const rendered = mount(<ResponsibilitySetCommentModal/>, {context: {store}});
        expect(rendered.find(".modal-title").at(0).text()).toEqual("Comment for touchstone-1, g1");
        expect(rendered.find(".modal-body textarea").at(0).props().value).toEqual("Duis aute");
        expect(rendered.find(".modal-footer span").at(0).text()).toEqual("Last updated by test.user at 2018-07-13 13:55:29 +0100");
    })

    it("saves comment", () => {
        const touchstone = mockTouchstoneVersion();
        const responsibilitySet = mockAnnotatedResponsibilitySet();
        const submitCallback = jest.fn();
        const closeCallback = jest.fn();
        const rendered = mount(
            <ResponsibilitySetCommentModalComponent
                addResponsibilitySetComment={submitCallback}
                setCurrentTouchstoneResponsibilitySet={closeCallback}
                responsibilitySet={responsibilitySet}
                currentTouchstoneVersion={touchstone.id}
            />
        );
        rendered.find(".modal-body textarea").at(0).simulate("change", {target: {value: "Ut enim"}});
        rendered.find(".btn-primary").simulate("click", mockEvent());
        expect(submitCallback.mock.calls.length).toEqual(1);
        expect(submitCallback.mock.calls[0]).toEqual([touchstone.id, responsibilitySet, "Ut enim"]);
        expect(closeCallback.mock.calls.length).toEqual(1);
        expect(closeCallback.mock.calls[0]).toEqual([null]);
    })

    it("cancels comment", () => {
        const touchstone = mockTouchstoneVersion();
        const responsibilitySet = mockAnnotatedResponsibilitySet();
        const submitCallback = jest.fn();
        const closeCallback = jest.fn();
        const rendered = mount(
            <ResponsibilitySetCommentModalComponent
                addResponsibilitySetComment={submitCallback}
                setCurrentTouchstoneResponsibilitySet={closeCallback}
                responsibilitySet={responsibilitySet}
                currentTouchstoneVersion={touchstone.id}
            />
        );
        rendered.find(".modal-body textarea").at(0).simulate("change", {target: {value: "Ut enim"}});
        rendered.find(".btn-secondary").simulate("click", mockEvent());
        expect(submitCallback.mock.calls.length).toEqual(0);
        expect(closeCallback.mock.calls.length).toEqual(1);
        expect(closeCallback.mock.calls[0]).toEqual([null]);
    })

    it("updates modal", async () => {
        const rendered = mount(
            <ResponsibilitySetCommentModalComponent
                addResponsibilitySetComment={jest.fn()}
                setCurrentTouchstoneResponsibilitySet={jest.fn()}
                responsibilitySet={mockAnnotatedResponsibilitySet()}
                currentTouchstoneVersion={mockTouchstoneVersion().id}
            />
        );
        expect(rendered.find(".modal-body textarea").at(0).props().value).toEqual("Duis aute");
        expect(rendered.find(".modal-footer span").at(0).text()).toEqual("Last updated by test.user at 2018-07-13 13:55:29 +0100");
        const responsibilitySet = mockAnnotatedResponsibilitySet({
            comment: "Ut enim",
            added_by: "test.user2",
            added_on: "2019-07-13 13:55:29 +0100"
        });
        rendered.setProps({responsibilitySet});
        expect(rendered.find(".modal-body textarea").at(0).props().value).toEqual("Ut enim");
        expect(rendered.find(".modal-footer span").at(0).text()).toEqual("Last updated by test.user2 at 2019-07-13 13:55:29 +0100");
    })

});
