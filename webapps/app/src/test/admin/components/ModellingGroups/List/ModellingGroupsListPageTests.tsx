import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {
    ModellingGroupsListPage,
    ModellingGroupsListPageComponent
} from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupsListPage";
import {mockMatch} from "../../../../mocks/mocks";
import {createMockStore} from "../../../../mocks/mockStore";
import {modellingGroupsListPageActionCreators} from "../../../../../main/admin/actions/pages/modellingGroupsListPageActionCreators";
import {ModellingGroupsListContent} from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupsListContent";

describe("Modelling Groups List Page Component Tests", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore();
        const rendered = shallow(<ModellingGroupsListPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders page component, title and sub component", () => {
        let testMatch = mockMatch<undefined>();
        let store = createMockStore();
        const onLoadStub = sandbox.setStubReduxAction(modellingGroupsListPageActionCreators, "onLoad");
        const rendered = shallow(<ModellingGroupsListPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(ModellingGroupsListPageComponent.title);
        expect(pageArticle.find(ModellingGroupsListContent).length).is.equal(1);
    });
});
