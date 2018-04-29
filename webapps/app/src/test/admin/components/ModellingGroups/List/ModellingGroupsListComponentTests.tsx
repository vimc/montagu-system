import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Store } from "redux";

import "../../../../helper";
import { mockModellingGroup } from "../../../../mocks/mockModels";
// import { alt } from "../../../../../main/shared/alt";
import { ModellingGroupsListContent } from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupsListContent";
import { ModellingGroupListItem } from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupListItem";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {AdminAppState} from "../../../../../main/admin/reducers/adminAppReducers";
import {createMockStore} from "../../../../mocks/mockStore";
import {Sandbox} from "../../../../Sandbox";

describe("Modelling Groups List Content Component connected tests", () => {

    const testGroup1 = mockModellingGroup()
    const testGroup2 = mockModellingGroup()

    const testState = {
        groups: {groups: [testGroup1, testGroup2]}
    }

    let store : Store<AdminAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore(testState);
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<ModellingGroupsListContent/>, {context: store});
        console.log(rendered.debug())

    })

    // it("can get props from stores", () => {
    //     const groups = [ mockModellingGroup(), mockModellingGroup() ];
    //     alt.bootstrap(JSON.stringify({
    //         GroupStore: {
    //             ready: true,
    //             groups: groups
    //         }
    //     }));
    //
    //     expect(ModellingGroupsListComponent.getPropsFromStores()).to.eql({
    //         ready: true,
    //         groups: groups
    //     });
    // });

    // it("renders items alphabetically", () => {
    //     const groups = [
    //         mockModellingGroup({ description: "z" }),
    //         mockModellingGroup({ description: "a" }),
    //         mockModellingGroup({ description: "m" })
    //     ];
    //     const rendered = shallow(<ModellingGroupsListComponent ready={ true } groups={ groups } />);
    //     const items = rendered.find(ModellingGroupListItem);
    //     expect(items).to.have.length(3);
    //     expect(items.at(0).prop("description")).to.equal("a");
    //     expect(items.at(1).prop("description")).to.equal("m");
    //     expect(items.at(2).prop("description")).to.equal("z");
    // });
});