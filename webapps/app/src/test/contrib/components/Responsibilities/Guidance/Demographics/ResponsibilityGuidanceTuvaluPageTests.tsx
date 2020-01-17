import * as React from "react";
import { shallow } from "enzyme";

import { Store } from "redux";

import "../../../../../helper";
import { Sandbox } from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";
import {PageArticle, PageArticleProps} from "../../../../../../main/shared/components/PageWithHeader/PageArticle";
import {ContribAppState} from "../../../../../../main/contrib/reducers/contribAppReducers";
import {breadcrumbsActionCreators} from "../../../../../../main/shared/actions/breadcrumbsActionsCreators";
import {ResponsibilityGuidanceTuvaluPage} from "../../../../../../main/contrib/components/Responsibilities/Guidance/Demographics/ResponsibilityGuidanceTuvaluPage";

describe("Guidance Tuvalu Page Component tests", () => {

    const sandbox = new Sandbox();

    let store : Store<ContribAppState>;
    beforeEach(() => {
        store = createMockStore();
    });
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        const rendered = shallow(<ResponsibilityGuidanceTuvaluPage/>, {context: {store}});
        expect(typeof rendered.props().createBreadcrumbs).toBe('function');
    });

    it("renders component on component level", () => {
        let store = createMockStore();
        const createBreadcrumbsStub = sandbox.setStubReduxAction(breadcrumbsActionCreators, "createBreadcrumbs");
        const rendered = shallow(<ResponsibilityGuidanceTuvaluPage/>, {context: {store}}).dive().dive().dive();
        expect(createBreadcrumbsStub.mock.calls.length).toBe(1);
        const pageArticle = rendered.find(PageArticle);
        const pageArticleProps = pageArticle.props() as PageArticleProps;
        expect(pageArticleProps.hideTitle).toBe(true);
        expect(pageArticleProps.title).toBe(undefined);
    });
});

