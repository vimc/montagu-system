import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import { mockModellingGroup } from "../../mocks/mockModels";

import { GroupList } from "../../../main/components/ChooseGroupAndTouchstone/GroupList";
import { GroupLink } from "../../../main/components/ChooseGroupAndTouchstone/GroupLink";

describe("GroupList", () => {
    it("renders one group link per group", () => {
        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        const rendered = shallow(<GroupList groups={ groups } selected={ groups[1] } ready={ true } />);
        const items = rendered.find(GroupLink);
        expect(items.at(0).props()).to.eql({
            group: groups[0],
            selected: false
        });
        expect(items.at(1).props()).to.eql({
            group: groups[1],
            selected: true
        });
    });
});