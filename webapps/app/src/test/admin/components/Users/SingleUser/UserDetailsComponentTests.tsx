import * as React from "react";

import {shallow} from "enzyme";

import "../../../../helper";
import {mockUser} from "../../../../mocks/mockModels";
import {
    mapStateToProps,
    UserDetailsContentComponent,
    UserRoles
} from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import {mockAdminState, mockAuthState} from "../../../../mocks/mockStates";
import {AddRoles} from "../../../../../main/admin/components/Users/SingleUser/AddRoles";

describe("UserDetailsContent", () => {

    it("passes props to UserRoles component", () => {
        const user = mockUser({username: "tets.user"});
        const rendered = shallow(<UserDetailsContentComponent user={user} canReadRoles={true} canWriteRoles={true}/>);
        const userRoles = rendered.find(UserRoles);
        expect(userRoles.prop("user")).toEqual(user);
        expect(userRoles.prop("canWriteRoles")).toBe(true);
    });

    it("does not render UserRoles if canReadRoles is false", () => {
        const user = mockUser({username: "tets.user"});
        const rendered = shallow(<UserDetailsContentComponent user={user} canReadRoles={false} canWriteRoles={false}/>);
        const userRoles = rendered.find(UserRoles);
        expect(userRoles).toHaveLength(0);
    });

    it(
        "maps canReadRoles property to true if user has '*roles.read' permission",
        () => {
            const adminStateMock = mockAdminState({auth: mockAuthState({permissions: ["*/roles.read"]})});
            const props = mapStateToProps(adminStateMock);
            expect(props.canReadRoles).toEqual(true);
        }
    );

    it(
        "maps canReadRoles property to false if user does not have '*roles.read' permission",
        () => {
            const adminStateMock = mockAdminState();
            const props = mapStateToProps(adminStateMock);
            expect(props.canReadRoles).toEqual(false);
        }
    );

    it(
        "maps canWriteRoles property to true if user has '*roles.write' permission",
        () => {
            const adminStateMock = mockAdminState({auth: mockAuthState({permissions: ["*/roles.write"]})});
            const props = mapStateToProps(adminStateMock);
            expect(props.canWriteRoles).toEqual(true);
        }
    );

    it(
        "maps canWriteRoles property to false if user does not have '*roles.write' permission",
        () => {
            const adminStateMock = mockAdminState();
            const props = mapStateToProps(adminStateMock);
            expect(props.canWriteRoles).toEqual(false);
        }
    );

});

describe("UserDetailRoles", () => {
    it("does not show add role widget if canWriteRoles is false", () => {
        const user = mockUser();
        const result = shallow(<UserRoles user={user} canWriteRoles={false}/>);
        expect(result.find(AddRoles).length).toEqual(0)
    });

    it("does show add role widget if canWriteRoles is true", () => {
        const user = mockUser();
        const result = shallow(<UserRoles user={user} canWriteRoles={true}/>);
        expect(result.find(AddRoles).length).toEqual(1);
    });
});
