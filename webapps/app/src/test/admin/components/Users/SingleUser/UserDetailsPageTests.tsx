import {Sandbox} from "../../../../Sandbox";
import {expect} from "chai";
import {mockMatch} from "../../../../mocks/mocks";
import * as React from "react";
import {UsersListPageComponent} from "../../../../../main/admin/components/Users/List/UsersListPage";
import {CreateUserSection} from "../../../../../main/admin/components/Users/Create/CreateUserSection";
import {UsersList} from "../../../../../main/admin/components/Users/List/UsersList";
import {createMockStore} from "../../../../mocks/mockStore";
import {shallow} from "enzyme";
import {
    UserDetailsPage, UserDetailsPageComponent
} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsPage";
import {userDetailsPageActionCreators} from "../../../../../main/admin/actions/pages/userDetailsPageActionCreators";
import {mockAdminState, mockAdminUsersState} from "../../../../mocks/mockStates";
import {mockUser} from "../../../../mocks/mockModels";
import {UserDetailsContent} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import {AdminAppState} from "../../../../../main/admin/reducers/adminAppReducers";

describe("UserDetailsPage", () => {
    const sandbox = new Sandbox();

    const mockUsersState = mockAdminUsersState({currentUser: mockUser({username: "fake.name", name: "Fake Name"})});
    const mockAdminAppState = mockAdminState({users:mockUsersState});

    let store: AdminAppState = null;

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

        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal("Fake Name");
        expect(pageArticle.find(UserDetailsContent).length).is.equal(1);
    });

    it("creates breadcrumb", () => {
        console.log(mockAdminAppState)
       const breadcrumb = UserDetailsPageComponent.breadcrumb(mockAdminAppState);

        expect(breadcrumb.name).is.equal("fake.name");
        expect(breadcrumb.urlFragment).is.equal("fake.name/");
        expect(breadcrumb.parent).to.deep.eq(UsersListPageComponent.breadcrumb());
    });
});
