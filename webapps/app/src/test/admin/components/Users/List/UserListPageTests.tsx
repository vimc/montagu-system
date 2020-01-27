import * as React from "react";


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

    it("renders page component, title and sub components", () => {
        let match = mockMatch<undefined>();
        let store = createMockStore();
        const onLoadStub = sandbox.setStubReduxAction(usersListPageActionCreators, "onLoad");
        const rendered = shallow(<UsersListPage location={null} router={null} history={null} match={match} />,
            {context: {store}}).dive();

        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.mock.calls.length).toBe(1);
        expect(pageArticle.props().title).toBe(UsersListPageComponent.title);
        expect(pageArticle.find(UsersList).length).toBe(1);
        expect(pageArticle.find(CreateUserSection).length).toBe(1);
    });
});
