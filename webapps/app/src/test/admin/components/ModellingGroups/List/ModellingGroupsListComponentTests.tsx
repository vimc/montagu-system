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
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";

describe("Modelling Groups List Content Component connected tests", () => {

    const testGroup1 = mockModellingGroup({id: 'g-1', description: "b"})
    const testGroup2 = mockModellingGroup({id: 'g-2', description: "a"})
    const testGroup3 = mockModellingGroup({id: 'g-3', description: "c"})

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const testState = {
            groups: {groups: [testGroup1]}
        }
        const store = createMockStore(testState);
        const rendered = shallow(<ModellingGroupsListContent/>, {context: {store}});
        expect(rendered.props().groups).to.eql([testGroup1]);
    })

    it("renders on connect level, passes null as groups", () => {
        const testState = {
            groups: {groups: null as any}
        }
        const store = createMockStore(testState);
        const rendered = shallow(<ModellingGroupsListContent/>, {context: {store}});
        expect(rendered.props().groups).to.eql([]);
    })

    it("renders on connect level, check if groups are sorted", () => {
        const testState = {
            groups: {groups: [testGroup1, testGroup2, testGroup3]}
        }
        const store = createMockStore(testState);
        const rendered = shallow(<ModellingGroupsListContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.equal(1);
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