import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import {
    CreateUserSection,
    CreateUserSectionComponent
} from "../../../../../main/admin/components/Users/Create/CreateUserSection";
import { Sandbox } from "../../../../Sandbox";
import { CreateUserForm } from "../../../../../main/admin/components/Users/Create/CreateUserForm";
import {usersActionCreators} from "../../../../../main/admin/actions/usersActionCreators";
import {mockAdminState, mockAdminUsersState} from "../../../../mocks/mockStates";
import {createMockStore} from "../../../../mocks/mockStore";

describe("CreateUserSectionComponenent", () => {
    const sandbox  = new Sandbox();
    afterEach(() => sandbox.restore());
    let store: any = null;

    before(() => {
        store = createMockStore(mockAdminState());
    });

    it("renders form when 'showCreateUser' is true", () => {
        store = createMockStore(mockAdminState({users: mockAdminUsersState({showCreateUser: true})}));
        const rendered = shallow(<CreateUserSection />, {context: {store}}).dive();
        expect(rendered.find(CreateUserForm)).to.have.length(1);
        expect(rendered.find("button")).to.have.length(0);
    });

    it("renders button when 'showCreateUser' is false", () => {
        store = createMockStore(mockAdminState({users: mockAdminUsersState({showCreateUser: false})}));
        const rendered = shallow(<CreateUserSection />, {context: {store}}).dive();
        expect(rendered.find(CreateUserForm)).to.have.length(0);
        expect(rendered.find("button")).to.have.length(1);
    });

    it("button triggers setShowCreateUser", () => {
        const spy = sandbox.setStubReduxAction(usersActionCreators, "setShowCreateUser");
        const rendered = shallow(<CreateUserSection />, {context: {store}}).dive();
        rendered.find("button").simulate("click");
        expect(spy.calledWith(true)).to.be.true;
    });
});