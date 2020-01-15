import * as React from "react";

import { expect } from "chai";
import { Sandbox } from "../../../../Sandbox";
import {mockMatch} from "../../../../mocks/mocks";

import {UsersListPage, UsersListPageComponent} from "../../../../../main/admin/components/Users/List/UsersListPage";
import {createMockStore} from "../../../../mocks/mockStore";
import {shallow} from "enzyme";
import {UsersList} from "../../../../../main/admin/components/Users/List/UsersList";
import {CreateUserSection} from "../../../../../main/admin/components/Users/Create/CreateUserSection";
import {usersListPageActionCreators} from "../../../../../main/admin/actions/pages/UsersListPageActionCreators";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";

describe("UserListPageTests", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    test("renders page component, title and sub components", () => {
        let match = mockMatch<undefined>();
        let store = createMockStore();
        const onLoadStub = sandbox.setStubReduxAction(usersListPageActionCreators, "onLoad");
        const rendered = shallow(<UsersListPage location={null} router={null} history={null} match={match} />,
            {context: {store}}).dive();

        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(UsersListPageComponent.title);
        expect(pageArticle.find(UsersList).length).is.equal(1);
        expect(pageArticle.find(CreateUserSection).length).is.equal(1);
    });
});
