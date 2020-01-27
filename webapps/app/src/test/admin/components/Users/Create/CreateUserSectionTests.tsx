import * as React from "react";

import {shallow} from "enzyme";
import {CreateUserSection} from "../../../../../main/admin/components/Users/Create/CreateUserSection";
import {Sandbox} from "../../../../Sandbox";
import {CreateUserForm} from "../../../../../main/admin/components/Users/Create/CreateUserForm";
import {usersActionCreators} from "../../../../../main/admin/actions/usersActionCreators";
import {mockAdminState, mockAdminUsersState, mockAuthState} from "../../../../mocks/mockStates";
import {createMockStore} from "../../../../mocks/mockStore";

describe("CreateUserSectionComponenent", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it(
        "renders form when 'showCreateUser' is true and user has 'users-create' permission",
        () => {
            const store = createMockStore(mockAdminState({
                users: mockAdminUsersState({showCreateUser: true}),
                auth: mockAuthState({
                    permissions: ["*/users.create"]
                })
            }));
            const rendered = shallow(<CreateUserSection/>, {context: {store}}).dive().dive();
            expect(rendered.find(CreateUserForm)).toHaveLength(1);
            expect(rendered.find("button")).toHaveLength(0);
        }
    );

    it(
        "renders button when 'showCreateUser' is false and user has 'users-create' permission",
        () => {
            const store = createMockStore(mockAdminState({
                users: mockAdminUsersState({showCreateUser: false}),
                auth: mockAuthState({
                    permissions: ["*/users.create"]
                })
            }));
            const rendered = shallow(<CreateUserSection/>, {context: {store}}).dive().dive();
            expect(rendered.find(CreateUserForm)).toHaveLength(0);
            expect(rendered.find("button")).toHaveLength(1);
        }
    );

    it(
        "renders nothing when user does not have 'users-create' permission",
        () => {
            const store = createMockStore(mockAdminState({users: mockAdminUsersState({showCreateUser: false})}));
            const rendered = shallow(<CreateUserSection/>, {context: {store}}).dive().dive();
            expect(rendered.find("button")).toHaveLength(0);
            expect(rendered.find("div")).toHaveLength(0);
        }
    );

    it("button triggers setShowCreateUser", () => {
        const store = createMockStore(mockAdminState({
            users: mockAdminUsersState({showCreateUser: false}),
            auth: mockAuthState({
                permissions: ["*/users.create"]
            })
        }));
        const spy = sandbox.setStubReduxAction(usersActionCreators, "setShowCreateUser");
        const rendered = shallow(<CreateUserSection/>, {context: {store}}).dive().dive();
        rendered.find("button").simulate("click");
        expect(spy.mock.calls[0][0]).toBe(true);
    });
});