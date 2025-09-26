import * as React from "react";
import { shallow } from "enzyme";


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

    it("renders component on compose level", () => {
        let store = createMockStore();
        const rendered = shallow(<ContribNoRouteFoundPage/>, {context: {store}});
        expect(typeof rendered.props().createBreadcrumbs).toBe('function');
    });

    it("renders component on component level", () => {
        let store = createMockStore();
        const createBreadcrumbsStub = sandbox.setStubReduxAction(breadcrumbsActionCreators, "createBreadcrumbs");
        const rendered = shallow(<ContribNoRouteFoundPage/>, {context: {store}}).dive().dive();
        const pageArticle = rendered.find(PageArticle);
        expect(createBreadcrumbsStub.mock.calls.length).toBe(1);
        expect(pageArticle.props().title).toBe(NoRouteFound.title());
    });
});

