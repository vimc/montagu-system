import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../helper";
import { Sandbox } from "../../Sandbox";
import {createMockStore} from "../../mocks/mockStore";
import {PageArticle} from "../../../main/shared/components/PageWithHeader/PageArticle";
import {
    ContribNoRouteFoundPage
} from "../../../main/contrib/components/ContribNoRouteFoundPage";
import {breadcrumbsActionCreators} from "../../../main/shared/actions/breadcrumbsActionsCreators";
import {NoRouteFound} from "../../../main/shared/components/NoRouteFound";

describe("Contrib No Route Found Page Component tests", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    test("renders component on compose level", () => {
        let store = createMockStore();
        const rendered = shallow(<ContribNoRouteFoundPage/>, {context: {store}});
        expect(typeof rendered.props().createBreadcrumbs).is.equal('function');
    });

    test("renders component on component level", () => {
        let store = createMockStore();
        const createBreadcrumbsStub = sandbox.setStubReduxAction(breadcrumbsActionCreators, "createBreadcrumbs");
        const rendered = shallow(<ContribNoRouteFoundPage/>, {context: {store}}).dive().dive();
        const pageArticle = rendered.find(PageArticle);
        expect(createBreadcrumbsStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(NoRouteFound.title());
    });
});

