import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import * as sinon from 'sinon';

import { mockModellingGroup } from "../../../mocks/mockModels";
import { ChooseGroupContentComponent } from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";
import { GroupList } from "../../../../main/contrib/components/ChooseGroup/GroupList";

describe("ChooseGroupContentComponent", () => {

    it("renders GroupList", () => {
        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        const dispatchSpy = sinon.spy();
        const rendered = shallow(<ChooseGroupContentComponent groups={groups} ready={true} dispatch={dispatchSpy} />);
        const list = rendered.find(GroupList);
        expect(list).to.have.length(1);
        expect(list.props()).to.eql({
            groups: groups
        });
    });
});