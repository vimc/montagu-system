import * as React from "react";

import {shallow} from "enzyme";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {
    ModellingGroupsListPage,
    ModellingGroupsListPageComponent
} from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupsListPage";
import {mockMatch} from "../../../../mocks/mocks";
import {createMockStore} from "../../../../mocks/mockStore";
import {modellingGroupsListPageActionCreators} from "../../../../../main/admin/actions/pages/ModellingGroupsListPageActionCreators";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {ModellingGroupsListContent} from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupsListContent";
import {ButtonLink} from "../../../../../main/shared/components/ButtonLink";

describe("Modelling Groups List Page Component Tests", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore();
        const rendered = shallow(<ModellingGroupsListPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).toBe('function');
    });

    it("renders page component, title and sub components", () => {
        let testMatch = mockMatch<undefined>();
        let store = createMockStore();
        const onLoadStub = sandbox.setStubReduxAction(modellingGroupsListPageActionCreators, "onLoad");
        const rendered = shallow(<ModellingGroupsListPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.called).toBe(true);
        expect(pageArticle.props().title).toBe(ModellingGroupsListPageComponent.title);
        expect(pageArticle.find(ModellingGroupsListContent).length).toBe(1);
        expect(pageArticle.find(ButtonLink).prop("href")).toBe("/modelling-groups/models")
    });
});
