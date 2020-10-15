import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockTouchstone, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {Touchstone} from "../../../../../main/shared/models/Generated";
import {TouchstoneList} from "../../../../../main/admin/components/Touchstones/List/TouchstoneList";
import {shallow} from "enzyme";
import * as React from "react";
import {TouchstoneTable} from "../../../../../main/admin/components/Touchstones/List/TouchstoneTable";


describe("TouchstoneList (admin)", () => {

    it("touchstone with one open version is active", () => {
        checkThatTouchstoneIsActive(true, mockTouchstone({id: "active1"}, [
            mockTouchstoneVersion({status: "open"}),
        ]));
    });
    it("touchstone with one in-preparation version is active", () => {
        checkThatTouchstoneIsActive(true, mockTouchstone({id: "active1"}, [
            mockTouchstoneVersion({status: "in-preparation"}),
        ]));
    });
    it("touchstone with several finished and one open version is active", () => {
        checkThatTouchstoneIsActive(true, mockTouchstone({id: "active3"}, [
            mockTouchstoneVersion({status: "finished"}),
            mockTouchstoneVersion({status: "finished"}),
            mockTouchstoneVersion({status: "open"}),
        ]));
    });
    it("touchstone with only finished versions is inactive", () => {
        checkThatTouchstoneIsActive(false, mockTouchstone({id: "active1"}, [
            mockTouchstoneVersion({status: "finished"}),
            mockTouchstoneVersion({status: "finished"})
        ]));
    });

    function checkThatTouchstoneIsActive(isActive: boolean, touchstone: Touchstone) {
        const store = createMockAdminStore({touchstones: {touchstones: [touchstone]}});
        const rendered = shallow(<TouchstoneList/>, {context: {store}}).dive();
        const sections = rendered.find(TouchstoneTable);
        const expectedSection = sections.at(isActive ? 0 : 1);
        const wrongSection = sections.at(isActive ? 1 : 0);
        expect(expectedSection.props()).toEqual({
            touchstones: [touchstone],
            showFinished: !isActive
        });
        expect(wrongSection.props()).toEqual({
            touchstones: [],
            showFinished: isActive
        });
    }
});