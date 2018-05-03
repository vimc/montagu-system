import * as React from "react";
import {expect} from "chai";
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
import {modellingGroupMembersPageActionCreators} from "../../../../../../main/admin/actions/pages/modellingGroupMembersPageActionCreators";
import {ModellingGroupMembersContent} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersContent";

describe("Modelling Group Members Page Component Tests", () => {

    const testGroup = mockModellingGroup();

    const testState = {
        groups: { currentGroup: testGroup}
    }

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore(testState);
        const rendered = shallow(<ModellingGroupMembersPage/>, {context: {store}});
        expect(rendered.props().groupDescription).is.equal(testGroup.description);
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders page component, title and sub component", () => {
        let testMatch = mockMatch<ModellingGroupMembersPageLocationProps>({groupId: testGroup.id});
        let store = createMockStore(testState);
        const onLoadStub = sandbox.setStubReduxAction(modellingGroupMembersPageActionCreators, "onLoad");
        const rendered = shallow(<ModellingGroupMembersPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(onLoadStub.getCall(0).args[0].groupId).is.equal(testGroup.id);
        expect(pageArticle.props().title).is.equal(`Manage membership for ${testGroup.description}`);
        expect(pageArticle.find(ModellingGroupMembersContent).length).is.equal(1);
    });

});
