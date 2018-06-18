import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../../../helper";
import {mockUser} from "../../../../mocks/mockModels";
import {
    mapStateToProps,
    UserDetailsContentComponent, UserRoles, UserRolesComponent
} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import {mockAdminState, mockAuthState} from "../../../../mocks/mockStates";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {AddRoles} from "../../../../../main/admin/components/Users/SingleUser/AddRoles";

describe("UserDetailsContent", () => {

    it("passes props to UserRoles component", () => {
        const user = mockUser({username: "tets.user"});
        const rendered = shallow(<UserDetailsContentComponent user={user} isAdmin={true} />);
        const userRoles = rendered.find(UserRoles);
        expect(userRoles.props()).to.deep.equal(user);
    });

    it("does not render UserRoles if isAdmin is false", () => {
        const user = mockUser({username: "tets.user"});
        const rendered = shallow(<UserDetailsContentComponent user={user} isAdmin={false} />);
        const userRoles = rendered.find(UserRoles);
        expect(userRoles).to.have.lengthOf(0);
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

describe("UserRolesComponent", () => {

    it("renders loading element if user roles is null", () => {

        const user = mockUser({username: "tets.user", roles: null});
        const rendered = shallow(<UserRoles {...user} />).dive();
        expect(rendered.find(LoadingElement)).to.have.lengthOf(1);
    });

    it("renders roles if user roles is not null", () => {

        const user = mockUser({username: "tets.user", roles: []});
        const rendered = shallow(<UserRoles {...user} />).dive();
        expect(rendered.find(AddRoles)).to.have.lengthOf(1);
    });

});