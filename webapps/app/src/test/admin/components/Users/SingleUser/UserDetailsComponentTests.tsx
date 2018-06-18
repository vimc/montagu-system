import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../../../helper";
import {mockUser} from "../../../../mocks/mockModels";
import {
    mapStateToProps,
    UserDetailsContentComponent, UserRoles
} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import {mockAdminState, mockAuthState} from "../../../../mocks/mockStates";

describe("UserDetailsContent", () => {

    it("passes props to UserRoles component", () => {
        const user = mockUser({username: "tets.user"});
        const rendered = shallow(<UserDetailsContentComponent user={user} canReadRoles={true} canWriteRoles={true}/>);
        const userRoles = rendered.find(UserRoles);
        expect(userRoles.prop("user")).to.deep.equal(user);
        expect(userRoles.prop("canWriteRoles")).to.be.true;
    });

    it("does not render UserRoles if canReadRoles is false", () => {
        const user = mockUser({username: "tets.user"});
        const rendered = shallow(<UserDetailsContentComponent user={user} canReadRoles={false} canWriteRoles={false}/>);
        const userRoles = rendered.find(UserRoles);
        expect(userRoles).to.have.lengthOf(0);
    });

    it("maps canReadRoles property to true if user has '*roles.read' permission", () => {
        const adminStateMock = mockAdminState({ auth: mockAuthState({permissions: ["*/roles.read"]}) });
        const props = mapStateToProps(adminStateMock);
        expect(props.canReadRoles).to.eq(true);
    });

    it("maps canReadRoles property to false if user does not have '*roles.read' permission", () => {
        const adminStateMock = mockAdminState();
        const props = mapStateToProps(adminStateMock);
        expect(props.canReadRoles).to.eq(false);
    });

    it("maps canWriteRoles property to true if user has '*roles.write' permission", () => {
        const adminStateMock = mockAdminState({ auth: mockAuthState({permissions: ["*/roles.write"]}) });
        const props = mapStateToProps(adminStateMock);
        expect(props.canWriteRoles).to.eq(true);
    });

    it("maps canWriteRoles property to false if user does not have '*roles.write' permission", () => {
        const adminStateMock = mockAdminState();
        const props = mapStateToProps(adminStateMock);
        expect(props.canWriteRoles).to.eq(false);
    });

});