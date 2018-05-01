import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../../../../helper";
import {Sandbox} from "../../../../../Sandbox";
import {mockMatch} from "../../../../../mocks/mocks";
import {
    GroupMembersPage,
    GroupMembersPageLocationProps
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/GroupMembersPage";
import {mockModellingGroup} from "../../../../../mocks/mockModels";
import {createMockStore} from "../../../../../mocks/mockStore";
import {modellingGroupMembersPageActionCreators} from "../../../../../../main/admin/actions/pages/modellingGroupMembersPageActionCreators";
import {GroupMembersContent} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/GroupMembersContent";

describe("Modelling Groups Members Page Component Tests", () => {

    const testGroup = mockModellingGroup();

    const testState = {
        groups: { currentGroup: testGroup}
    }

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore(testState);
        const rendered = shallow(<GroupMembersPage/>, {context: {store}});
        expect(rendered.props().groupDescription).is.equal(testGroup.description);
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders page component, title and sub component", () => {
        let testMatch = mockMatch<GroupMembersPageLocationProps>({groupId: testGroup.id});
        let store = createMockStore(testState);
        const onLoadStub = sandbox.setStubReduxAction(modellingGroupMembersPageActionCreators, "onLoad");
        const rendered = shallow(<GroupMembersPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(onLoadStub.getCall(0).args[0].groupId).is.equal(testGroup.id);
        expect(pageArticle.props().title).is.equal(`Manage membership for ${testGroup.description}`);
        expect(pageArticle.find(GroupMembersContent).length).is.equal(1);
    });

});
