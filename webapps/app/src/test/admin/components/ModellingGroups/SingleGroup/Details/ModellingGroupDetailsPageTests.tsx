import * as React from "react";

import {shallow} from "enzyme";

import "../../../../../helper";
import { Sandbox } from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";
import {mockMatch} from "../../../../../mocks/mocks";
import {
    ModellingGroupDetailsPage,
    ModellingGroupDetailsPageLocationProps
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ModellingGroupDetailsPage";
import {mockModellingGroup} from "../../../../../mocks/mockModels";
import {modellingGroupDetailsPageActionCreators} from "../../../../../../main/admin/actions/pages/ModellingGroupDetailsPageActionCreators";
import {ModellingGroupDetailsContent} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/ModellingGroupDetailsContent";
import {PageArticle} from "../../../../../../main/shared/components/PageWithHeader/PageArticle";

describe("Modelling Group Details Page Component Tests", () => {

    const testGroup = mockModellingGroup();

    const testState = {
        groups: {currentGroup: testGroup}
    };

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore(testState);
        const rendered = shallow(<ModellingGroupDetailsPage/>, {context: {store}});
        expect(rendered.props().groupDescription).toBe(testGroup.description);
        expect(typeof rendered.props().onLoad).toBe('function');
    });

    it("renders page component, title and sub component", () => {
        let testMatch = mockMatch<ModellingGroupDetailsPageLocationProps>({groupId: testGroup.id});
        let store = createMockStore(testState);
        const onLoadStub = sandbox.setStubReduxAction(modellingGroupDetailsPageActionCreators, "onLoad");
        const rendered = shallow(<ModellingGroupDetailsPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.called).toBe(true);
        expect(pageArticle.props().title).toBe(testGroup.description);
        expect(pageArticle.find(ModellingGroupDetailsContent).length).toBe(1);
    });
});



