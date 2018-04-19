import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../helper";
import { Sandbox } from "../../Sandbox";
import {createMockStore} from "../../mocks/mockStore";
import {PageArticle} from "../../../main/shared/components/PageWithHeader/PageArticle";
import {
    ContribForgottenPasswordPage
} from "../../../main/contrib/components/ContribForgottenPasswordPage";
import {breadcrumbsActionCreators} from "../../../main/shared/actions/breadcrumbsActionsCreators";
import {ForgottenPasswordForm} from "../../../main/shared/components/Login/ForgottenPasswordForm";

describe("Contrib Forgotten Password Page Component", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on compose level", () => {
        let store = createMockStore();
        const rendered = shallow(<ContribForgottenPasswordPage/>, {context: {store}});
        expect(typeof rendered.props().createBreadcrumbs).is.equal('function');
    });

    it("renders component on component level", () => {
        let store = createMockStore();
        const createBreadcrumbsStub = sandbox.setStubFunc(breadcrumbsActionCreators, "createBreadcrumbs", () => ({type: 'any'}));
        const rendered = shallow(<ContribForgottenPasswordPage/>, {context: {store}}).dive().dive();
        const pageArticle = rendered.find('PageArticle');
        expect(createBreadcrumbsStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal("Forgotten your password?");
        expect(pageArticle.find(ForgottenPasswordForm).length).is.equal(1);
    });
});

