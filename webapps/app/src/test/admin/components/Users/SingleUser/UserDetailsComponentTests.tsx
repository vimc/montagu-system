import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../../../helper";
import {mockUser} from "../../../../mocks/mockModels";
import {
    mapStateToProps,
    UserDetailsContentComponent, UserRoles
} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import { AddRoles } from "../../../../../main/admin/components/Users/SingleUser/AddRoles";
import {mockAdminState, mockAuthState} from "../../../../mocks/mockStates";

describe("UserDetailsContent", () => {

    it("passes props to UserRole component", () => {
        const user = mockUser({username: "tets.user"});
        const rendered = shallow(<UserDetailsContentComponent user={user} isAdmin={true} />);
        const userRoles = rendered.find(UserRoles);
        expect(userRoles.prop("user")).to.eq(user);
        expect(userRoles.prop("isAdmin")).to.eq(true);
    });

    it("maps isAdmin property to true if user has '*roles.write' permission", () => {
        const adminStateMock = mockAdminState({ auth: mockAuthState({permissions: ["*/roles.write"]}) });
        const props = mapStateToProps(adminStateMock);
        expect(props.isAdmin).to.eq(true);
    });

    it("maps isAdmin property to false if user does not have '*roles.write' permission", () => {
        const adminStateMock = mockAdminState();
        const props = mapStateToProps(adminStateMock);
        expect(props.isAdmin).to.eq(false);
    });

});

describe("UserDetailRoles", () => {

    it("does not show add role widget if isAdmin is false", () => {
        const user = mockUser({username: "tets.user"});
        const result = shallow(<UserRoles user={user} isAdmin={false} />);
        expect(result.find(AddRoles).length).to.eq(0)
    });

    it("does show add role widget if isAdmin is true", () => {
        const user = mockUser({username: "tets.user"});
        const result = shallow(<UserRoles user={user} isAdmin={false} />);
        expect(result.find(AddRoles).length).to.eq(0)
    });

});