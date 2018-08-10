import * as React from "react";
import { expect } from "chai";
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
        expect(rendered.props().groupDescription).is.equal(testGroup.description);
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders page component, title and sub component", () => {
        let testMatch = mockMatch<ModellingGroupDetailsPageLocationProps>({groupId: testGroup.id});
        let store = createMockStore(testState);
        const onLoadStub = sandbox.setStubReduxAction(modellingGroupDetailsPageActionCreators, "onLoad");
        const rendered = shallow(<ModellingGroupDetailsPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(testGroup.description);
        expect(pageArticle.find(ModellingGroupDetailsContent).length).is.equal(1);
    });
});



