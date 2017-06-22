import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { mockModellingGroup } from "../../../mocks/mockModels";

import { ChooseGroupContentComponent } from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";
import { GroupList } from "../../../../main/contrib/components/ChooseGroup/GroupList";
import { alt } from "../../../../main/shared/alt";

describe("ChooseGroupContentComponent", () => {
    it("gets props from stores", () => {
        alt.bootstrap(JSON.stringify({
            ContribAuthStore: { modellingGroups: [] }
        }));
        expect(ChooseGroupContentComponent.getPropsFromStores()).to.eql({
            groups: [],
            ready: false
        });

        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        alt.bootstrap(JSON.stringify({
            ContribAuthStore: { modellingGroups: groups }
        }));
        expect(ChooseGroupContentComponent.getPropsFromStores()).to.eql({
            groups: groups,
            ready: true
        });
    });

    it("renders GroupList", () => {
        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        const rendered = shallow(<ChooseGroupContentComponent groups={ groups } ready={ true } />);
        const list = rendered.find(GroupList);
        expect(list).to.have.length(1);
        expect(list.props()).to.eql({
            groups: groups
        });
    });
});