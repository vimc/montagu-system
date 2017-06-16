import * as React from "react";
import { alt } from "../../../../../main/shared/alt";
import { expect } from "chai";
import { mockModellingGroup } from "../../../../mocks/mockModels";
import { shallow } from "enzyme";

import { ModellingGroupsListComponent } from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupsList";
import { ModellingGroupListItem } from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupListItem";

describe("ModellingGroupsListComponent", () => {
    it("can get props from stores", () => {
        const groups = [ mockModellingGroup(), mockModellingGroup() ];
        alt.bootstrap(JSON.stringify({
            GroupStore: {
                ready: true,
                groups: groups
            }
        }));

        expect(ModellingGroupsListComponent.getPropsFromStores()).to.eql({
            ready: true,
            groups: groups
        });
    });

    it("renders items alphabetically", () => {
        const groups = [
            mockModellingGroup({ description: "z" }),
            mockModellingGroup({ description: "a" }),
            mockModellingGroup({ description: "m" })
        ];
        const rendered = shallow(<ModellingGroupsListComponent ready={ true } groups={ groups } />);
        const items = rendered.find(ModellingGroupListItem);
        expect(items).to.have.length(3);
        expect(items.at(0).prop("description")).to.equal("a");
        expect(items.at(1).prop("description")).to.equal("m");
        expect(items.at(2).prop("description")).to.equal("z");
    });
});