import {Sandbox} from "../../../../Sandbox";

import {mockMatch} from "../../../../mocks/mocks";
import * as React from "react";
import {createMockStore} from "../../../../mocks/mockStore";
import {shallow} from "enzyme";
import {
    UserDetailsPage
} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsPage";
import {userDetailsPageActionCreators} from "../../../../../main/admin/actions/pages/UserDetailsPageActionCreators";
import {mockAdminState, mockAdminUsersState} from "../../../../mocks/mockStates";
import {mockUser} from "../../../../mocks/mockModels";
import {UserDetailsContent} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import {AdminAppState} from "../../../../../main/admin/reducers/adminAppReducers";
import {MockStore} from "redux-mock-store";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";

describe("UserDetailsPage", () => {
    const sandbox = new Sandbox();

    const mockUsersState = mockAdminUsersState({currentUser: mockUser({username: "fake.name", name: "Fake Name"})});
    const mockAdminAppState = mockAdminState({users: mockUsersState});

    let store: MockStore<AdminAppState> = null;

    beforeEach(() => {
        store = createMockStore(mockAdminAppState);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("renders page component, title and sub components", () => {
        const match = mockMatch<undefined>();

        const onLoadStub = sandbox.setStubReduxAction(userDetailsPageActionCreators, "onLoad");

        const rendered = shallow(<UserDetailsPage location={null} router={null} history={null} match={match}/>,
            {context: {store}}).dive();

        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.mock.calls.length).toBe(1);
        expect(pageArticle.props().title).toBe("Fake Name");
        expect(pageArticle.find(UserDetailsContent).length).toBe(1);
    });

});
