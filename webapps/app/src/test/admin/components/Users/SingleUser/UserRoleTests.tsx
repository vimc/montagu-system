import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {UserRole, UserRoleComponent} from "../../../../../main/admin/components/Users/SingleUser/UserRole";
import {RoleAssignment} from "../../../../../main/shared/models/Generated";
import {mockRole, mockUser} from "../../../../mocks/mockModels";
import { InternalLink } from "../../../../../main/shared/components/InternalLink";
import {createMockStore} from "../../../../mocks/mockStore";
import {AdminAppState} from "../../../../../main/admin/reducers/adminAppReducers";
import {mockAdminState, mockAdminUsersState} from "../../../../mocks/mockStates";
import {MockStore} from "redux-mock-store";

describe("UserRole", () => {

    const mockUsersState = mockAdminUsersState({currentUser: mockUser({username: "fake.name", name: "Fake Name"})});
    const mockAdminAppState = mockAdminState({users: mockUsersState});

    const fakeRole = mockRole({name: "rolename"});

    let store: MockStore<AdminAppState> = null;

    beforeEach(() => {
        store = createMockStore(mockAdminAppState);
    });

    it("does not show scope if global", () => {

        const rendered = shallow(<UserRoleComponent removeRoleFromUser={null}
                                                    { ...fakeRole} username="testuser" showdelete={true}/>);
        const text = rendered.find('.role-name').text();

        expect(text).to.eq("rolename")
    });

    it("shows scope if not global", () => {

        const role: RoleAssignment = mockRole({name: "rolename", scope_prefix: "group", scope_id: "fake"});
        const rendered = shallow(<UserRoleComponent removeRoleFromUser={null}
                                                    { ...role} username="testuser" showdelete={true}/>);
        const text = rendered.find('.role-name').text();

        expect(text).to.eq("rolename / group:fake")
    });


    it("shows delete button", () => {

        const rendered = shallow(<UserRoleComponent removeRoleFromUser={null}
                                                    { ...fakeRole} username="testuser" showdelete={true}/>);

        const text = rendered.find(InternalLink).dive().text();
        expect(text).to.eq("Remove role");

    });

    it("does not show delete button", () => {

        const rendered = shallow(<UserRoleComponent removeRoleFromUser={null}
                                                    { ...fakeRole} username="testuser" showdelete={false}/>);
        expect(rendered.find(InternalLink).length).to.eq(0);
    });

});