import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {UserRole} from "../../../../../main/admin/components/Users/SingleUser/UserRole";
import {RoleAssignment} from "../../../../../main/shared/models/Generated";
import {mockRole, mockUser} from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { InternalLink } from "../../../../../main/shared/components/InternalLink";
import {createMockStore} from "../../../../mocks/mockStore";
import {AdminAppState} from "../../../../../main/admin/reducers/adminAppReducers";
import {mockAdminState, mockAdminUsersState} from "../../../../mocks/mockStates";

describe("UserRole", () => {

    const mockUsersState = mockAdminUsersState({currentUser: mockUser({username: "fake.name", name: "Fake Name"})});
    const mockAdminAppState = mockAdminState({users: mockUsersState});

    let store: AdminAppState = null;

    beforeEach(() => {
        store = createMockStore(mockAdminAppState);
    });

    it("does not show scope if global", () => {

        const role: RoleAssignment = mockRole();
        role.scope_prefix = "";
        role.name = "rolename";
        const rendered = shallow(<UserRole { ...role} username="testuser" showdelete={true}/>, {context: {store}});
        const text = rendered.find('.role-name').text();

        expect(text).to.eq("rolename")
    });

    it("shows scope if not global", () => {

        const role: RoleAssignment = mockRole();
        role.scope_prefix = "group";
        role.scope_id = "fake";
        role.name = "rolename";
        const rendered = shallow(<UserRole { ...role} username="testuser" showdelete={true}/>, {context: {store}});
        const text = rendered.find('.role-name').text();

        expect(text).to.eq("rolename / group:fake")
    });


    it("shows delete button", () => {

        const sandbox = new Sandbox();
        const role: RoleAssignment = mockRole();
        role.scope_prefix = "group";
        role.scope_id = "fake";
        role.name = "rolename";
        const rendered = sandbox.mount(<UserRole { ...role} username="testuser" showdelete={true}/>, {context: {store}});
        const text = rendered.find(InternalLink).text();

        expect(text).to.eq("Remove role")

        sandbox.restore();
    });

    it("does not show delete button", () => {

        const role: RoleAssignment = mockRole();
        role.scope_prefix = "group";
        role.scope_id = "fake";
        role.name = "rolename";
        const rendered = shallow(<UserRole { ...role} username="testuser" showdelete={false}/>, {context: {store}});
        expect(rendered.find(InternalLink).length).to.eq(0)
    });

});