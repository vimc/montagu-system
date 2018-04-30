import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {breadcrumbsActionCreators} from "../../../../../main/shared/actions/breadcrumbsActionsCreators";
import {
    ResponsibilityGuidanceModelOutputsPage,
    ResponsibilityGuidanceModelOutputsPageComponent
} from "../../../../../main/contrib/components/Responsibilities/Guidance/ResponsibilityGuidanceModelOutputsPage";

describe("Guidance Model Outputs Page Component tests", () => {

    const sandbox = new Sandbox();

    let store : Store<ContribAppState>;
    beforeEach(() => {
        store = createMockStore();
    });
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        const rendered = shallow(<ResponsibilityGuidanceModelOutputsPage/>, {context: {store}});
        expect(typeof rendered.props().createBreadcrumbs).is.equal('function');
    });

    it("renders component on component level", () => {
        let store = createMockStore();
        const createBreadcrumbsStub = sandbox.setStubReduxAction(breadcrumbsActionCreators, "createBreadcrumbs");
        const rendered = shallow(<ResponsibilityGuidanceModelOutputsPage/>, {context: {store}}).dive().dive();
        const pageArticle = rendered.find('PageArticle');
        expect(createBreadcrumbsStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(ResponsibilityGuidanceModelOutputsPageComponent.title);
    });
});

