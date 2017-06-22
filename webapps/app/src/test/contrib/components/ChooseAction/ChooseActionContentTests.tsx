import { shallow } from "enzyme";
import { expect } from "chai";
import { ChooseActionContentComponent } from "../../../../main/contrib/components/ChooseAction/ChooseActionContent";
import { mockModellingGroup, mockTouchstone } from "../../../mocks/mockModels";
import * as React from "react";
import { TouchstoneList } from "../../../../main/contrib/components/ChooseAction/TouchstoneList";

describe("ChooseActionContentComponent", () => {
    it("renders TouchstoneList", () => {
        const touchstones = [ mockTouchstone(), mockTouchstone() ];
        const group = mockModellingGroup();
        const rendered = shallow(<ChooseActionContentComponent
            touchstones={ touchstones }
            group={ group }
            ready={ true } />);
        const list = rendered.find(TouchstoneList);
        expect(list.length).to.equal(1);
        expect(list.props()).to.eql({
            touchstones: touchstones,
            group: group,
            ready: true
        });
    });
});