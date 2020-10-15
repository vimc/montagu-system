import {shallow} from "enzyme";
import * as React from "react";
import {TouchstoneTable} from "../../../../../main/admin/components/Touchstones/List/TouchstoneTable";
import {mockTouchstone} from "../../../../mocks/mockModels";
import {TouchstoneListItem} from "../../../../../main/admin/components/Touchstones/List/TouchstoneListItem";

describe("TouchstoneTable", () => {

    it("passes showFinished prop to list items", () => {
        const t = mockTouchstone();
        let rendered = shallow(<TouchstoneTable showFinished={true} touchstones={[t]} />);
        expect(rendered.find(TouchstoneListItem).props()).toEqual({...t, showFinished: true});

        rendered = shallow(<TouchstoneTable showFinished={false} touchstones={[t]} />);
        expect(rendered.find(TouchstoneListItem).props()).toEqual({...t, showFinished: false});
    });
});