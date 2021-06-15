import {
    mockAnnotatedResponsibility,
    mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mount} from "enzyme";
import {
    ResponsibilityCommentModal,
    ResponsibilityCommentModalComponent
} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/ResponsibilityCommentModal";
import * as React from "react";
import {mockEvent} from "../../../../mocks/mocks";

describe("ResponsibilityCommentModal", () => {

    it("renders modal", () => {
        const store = createMockAdminStore({
            touchstones: {
                currentTouchstoneVersion: mockTouchstoneVersion(),
                currentResponsibility: mockAnnotatedResponsibility()
            }
        });
        const rendered = mount(<ResponsibilityCommentModal/>, {context: {store}});
        expect(rendered.find(".modal-title").at(0).text()).toEqual("Comment for touchstone-1, g1, Description");
        expect(rendered.find(".modal-body textarea").at(0).props().value).toEqual("Lorem ipsum");
        expect(rendered.find(".modal-footer span").at(0).text()).toEqual("Last updated by test.user at 2017-07-13 13:55:29 +0100");
    })

    it("saves comment", () => {
        const touchstone = mockTouchstoneVersion();
        const responsibility = mockAnnotatedResponsibility();
        const submitCallback = jest.fn();
        const cancelCallback = jest.fn();
        const rendered = mount(
            <ResponsibilityCommentModalComponent
                addResponsibilityComment={submitCallback}
                setCurrentTouchstoneResponsibility={cancelCallback}
                responsibility={responsibility}
                currentTouchstoneVersion={touchstone.id}
            />
        );
        rendered.find(".modal-body textarea").at(0).simulate("change", {target: {value: "Ut enim"}});
        rendered.find(".btn-primary").simulate("click", mockEvent());
        expect(submitCallback.mock.calls.length).toEqual(1);
        expect(submitCallback.mock.calls[0]).toEqual([touchstone.id, responsibility, "Ut enim"]);
        expect(cancelCallback.mock.calls.length).toEqual(0);
    })

    it("cancels comment", () => {
        const touchstone = mockTouchstoneVersion();
        const responsibility = mockAnnotatedResponsibility();
        const submitCallback = jest.fn();
        const cancelCallback = jest.fn();
        const rendered = mount(<ResponsibilityCommentModalComponent addResponsibilityComment={submitCallback} setCurrentTouchstoneResponsibility={cancelCallback} responsibility={responsibility} currentTouchstoneVersion={touchstone.id}/>);
        rendered.find(".modal-body textarea").at(0).simulate("change", {target: {value: "Ut enim"}});
        rendered.find(".btn-secondary").simulate("click", mockEvent());
        expect(submitCallback.mock.calls.length).toEqual(0);
        expect(cancelCallback.mock.calls.length).toEqual(1);
        expect(cancelCallback.mock.calls[0]).toEqual([null]);
    })

    it("updates modal", async () => {
        const rendered = mount(
            <ResponsibilityCommentModalComponent
                addResponsibilityComment={jest.fn()}
                setCurrentTouchstoneResponsibility={jest.fn()}
                responsibility={mockAnnotatedResponsibility()}
                currentTouchstoneVersion={mockTouchstoneVersion().id}
            />
        );
        expect(rendered.find(".modal-body textarea").at(0).props().value).toEqual("Lorem ipsum");
        expect(rendered.find(".modal-footer span").at(0).text()).toEqual("Last updated by test.user at 2017-07-13 13:55:29 +0100");
        const responsibility = mockAnnotatedResponsibility(null, {
            comment: "Ut enim",
            added_by: "test.user2",
            added_on: "2018-07-13 13:55:29 +0100"
        });
        rendered.setProps({responsibility});
        expect(rendered.find(".modal-body textarea").at(0).props().value).toEqual("Ut enim");
        expect(rendered.find(".modal-footer span").at(0).text()).toEqual("Last updated by test.user2 at 2018-07-13 13:55:29 +0100");
    })

});
