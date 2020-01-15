import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../../helper";
import { Sandbox } from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";
import {PageArticle, PageArticleProps} from "../../../../../../main/shared/components/PageWithHeader/PageArticle";
import {ContribAppState} from "../../../../../../main/contrib/reducers/contribAppReducers";
import {breadcrumbsActionCreators} from "../../../../../../main/shared/actions/breadcrumbsActionsCreators";
import {ResponsibilityGuidanceKosovoPage} from "../../../../../../main/contrib/components/Responsibilities/Guidance/Demographics/ResponsibilityGuidanceKosovoPage";

describe("Guidance Kosovo Page Component tests", () => {

    const sandbox = new Sandbox();

    let store : Store<ContribAppState>;
    beforeEach(() => {
        store = createMockStore();
    });
    afterEach(() => sandbox.restore());

    test("renders component on connect level", () => {
        const rendered = shallow(<ResponsibilityGuidanceKosovoPage/>, {context: {store}});
        expect(typeof rendered.props().createBreadcrumbs).is.equal('function');
    });

    test("renders component on component level", () => {
        let store = createMockStore();
        const createBreadcrumbsStub = sandbox.setStubReduxAction(breadcrumbsActionCreators, "createBreadcrumbs");
        const rendered = shallow(<ResponsibilityGuidanceKosovoPage/>, {context: {store}}).dive().dive().dive();
        expect(createBreadcrumbsStub.called).is.equal(true);
        const pageArticle = rendered.find(PageArticle);
        const pageArticleProps = pageArticle.props() as PageArticleProps;
        expect(pageArticleProps.hideTitle).is.equal(true);
        expect(pageArticleProps.title).is.equal(undefined);
    });
});

