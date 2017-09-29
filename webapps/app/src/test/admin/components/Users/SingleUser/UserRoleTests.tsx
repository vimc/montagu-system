import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {UserRole} from "../../../../../main/admin/components/Users/SingleUser/UserRoleComponent";
import {RoleAssignment} from "../../../../../main/shared/models/Generated";
import {mockRole} from "../../../../mocks/mockModels";

describe("UserRole", () => {
    it("does not show scope if global", () => {

        const role: RoleAssignment = mockRole();
        role.scope_prefix = "";
        role.name = "rolename";
        const rendered = shallow(<UserRole { ...role} username="testuser" showdelete={true}/>);
        const text = rendered.find('.role-name').text();

        expect(text).to.eq("rolename")
    });

    it("shows scope if not global", () => {

        const role: RoleAssignment = mockRole();
        role.scope_prefix = "group";
        role.scope_id = "fake";
        role.name = "rolename";
        const rendered = shallow(<UserRole { ...role} username="testuser" showdelete={true}/>);
        const text = rendered.find('.role-name').text();

        expect(text).to.eq("rolename / group:fake")
    });


    it("shows delete button", () => {

        const role: RoleAssignment = mockRole();
        role.scope_prefix = "group";
        role.scope_id = "fake";
        role.name = "rolename";
        const rendered = shallow(<UserRole { ...role} username="testuser" showdelete={true}/>);
        const text = rendered.find('.text-danger').text();

        expect(text).to.eq("Remove role")
    });

    it("does not show delete button", () => {

        const role: RoleAssignment = mockRole();
        role.scope_prefix = "group";
        role.scope_id = "fake";
        role.name = "rolename";
        const rendered = shallow(<UserRole { ...role} username="testuser" showdelete={false}/>);
        expect(rendered.find('.text-danger').length).to.eq(0)
    });

});