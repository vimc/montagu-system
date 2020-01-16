import * as React from "react";

import {shallow} from "enzyme";

import "../../../../../helper";
import {Sandbox} from "../../../../../Sandbox";
import {mockMatch} from "../../../../../mocks/mocks";
import {
    ModellingGroupMembersPage,
    ModellingGroupMembersPageLocationProps
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersPage";
import {mockModellingGroup} from "../../../../../mocks/mockModels";
import {createMockStore} from "../../../../../mocks/mockStore";
import {modellingGroupMembersPageActionCreators} from "../../../../../../main/admin/actions/pages/ModellingGroupMembersPageActionCreators";
import {ModellingGroupMembersContent} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersContent";
import {PageArticle} from "../../../../../../main/shared/components/PageWithHeader/PageArticle";

describe("Modelling Group Members Page Component Tests", () => {

    const testGroup = mockModellingGroup();

    const testState = {
        groups: { currentGroup: testGroup}
    };

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore(testState);
        const rendered = shallow(<ModellingGroupMembersPage/>, {context: {store}});
        expect(rendered.props().groupDescription).toBe(testGroup.description);
        expect(typeof rendered.props().onLoad).toBe('function');
    });

    it("renders page component, title and sub component", () => {
        let testMatch = mockMatch<ModellingGroupMembersPageLocationProps>({groupId: testGroup.id});
        let store = createMockStore(testState);
        const onLoadStub = sandbox.setStubReduxAction(modellingGroupMembersPageActionCreators, "onLoad");
        const rendered = shallow(<ModellingGroupMembersPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.called).toBe(true);
        expect(onLoadStub.getCall(0).args[0].groupId).toBe(testGroup.id);
        expect(pageArticle.props().title).toBe(`Manage membership for ${testGroup.description}`);
        expect(pageArticle.find(ModellingGroupMembersContent).length).toBe(1);
    });

});
