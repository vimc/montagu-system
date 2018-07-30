import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../helper";
import { Sandbox } from "../../Sandbox";
import {createMockStore} from "../../mocks/mockStore";
import {PageArticle} from "../../../main/shared/components/PageWithHeader/PageArticle";
import {breadcrumbsActionCreators} from "../../../main/shared/actions/breadcrumbsActionsCreators";
import {ForgottenPasswordForm} from "../../../main/shared/components/Login/ForgottenPasswordForm";
import {ForgottenPasswordPage} from "../../../main/shared/components/ForgottenPasswordPage";

describe("ForgottenPasswordPage", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on compose level", () => {
        let store = createMockStore();
        const rendered = shallow(<ForgottenPasswordPage/>, {context: {store}});
        expect(typeof rendered.props().createBreadcrumbs).is.equal('function');
    });

    it("renders component on component level", () => {
        let store = createMockStore();
        const createBreadcrumbsStub = sandbox.setStubReduxAction(breadcrumbsActionCreators, "createBreadcrumbs");
        const rendered = shallow(<ForgottenPasswordPage/>, {context: {store}}).dive().dive();
        const pageArticle = rendered.find('PageArticle');
        expect(createBreadcrumbsStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal("Forgotten your password?");
        expect(pageArticle.find(ForgottenPasswordForm).length).is.equal(1);
    });
});

