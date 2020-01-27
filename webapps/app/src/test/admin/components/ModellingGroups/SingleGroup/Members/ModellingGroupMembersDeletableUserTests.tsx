import * as React from "react";

import { shallow } from "enzyme";

import "../../../../../helper";
import { mockUser } from "../../../../../mocks/mockModels";
import { Sandbox } from "../../../../../Sandbox";
import { InternalLink } from "../../../../../../main/shared/components/InternalLink";
import {
    ModellingGroupMembersDeletableUser,
    ModellingGroupMembersDeletableUserComponent
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersDeletableUser";
import {createMockStore} from "../../../../../mocks/mockStore";
import {modellingGroupsActionCreators} from "../../../../../../main/admin/actions/modellingGroupsActionCreators";

describe("Modelling Group Members Deletable User Component tests", () => {

    describe("Connected", () => {

        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        it("passes right props on connect level", () => {
            const store = createMockStore();
            const testUser = mockUser();
            const rendered = shallow(<ModellingGroupMembersDeletableUser
                user={testUser}
                groupId={"g-1"}
                showDelete={true}
            />, {context: {store}});
            expect(rendered.props().user).toEqual(testUser);
            expect(rendered.props().groupId).toEqual("g-1");
            expect(rendered.props().showDelete).toBe(true);
            expect(typeof rendered.props().removeUserFromGroup).toEqual("function");
        });

        it("triggers action on remove click", () => {
            const store = createMockStore();
            const testUser = mockUser();
            const rendered = shallow(<ModellingGroupMembersDeletableUser
                user={testUser}
                groupId={"g-1"}
                showDelete={true}
            />, {context: {store}}).dive();
            const deleteLink = rendered.find(".text-danger").dive();
            const removeActionStub = sandbox.setStubReduxAction(modellingGroupsActionCreators, "removeUserFromGroup");
            deleteLink.simulate("click");
            expect(removeActionStub.mock.calls.length).toBe(1);
            expect(removeActionStub.mock.calls[0][0]).toEqual("g-1");
            expect(removeActionStub.mock.calls[0][1]).toEqual(testUser.username);
        });
    });

    describe("Component", () => {

        const testUser = mockUser({"username": "w.a.m", "name": "Wolfgang Amadeus Mozart"});

        const sandbox = new Sandbox();
        let removeSpy: jest.Mock;
        beforeEach(() => {
            removeSpy = sandbox.createSpy();
        });
        afterEach(() => sandbox.restore());

        it("renders link to user page", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={true}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            expect(rendered.find(InternalLink).at(0).prop("href")).toEqual("/users/w.a.m/")
        });

        it("renders delete link", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={true}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            const deleteInternalLink = rendered.find(".text-danger");
            expect(deleteInternalLink.dive().text()).toEqual("Remove member")
        });

        it("does not render delete link if showDelete is false", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={false}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            const deleteInternalLink = rendered.find(".text-danger");
            expect(deleteInternalLink.length).toEqual(0);
        });

        it("triggers remove function", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={true}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            const deleteLink = rendered.find(".text-danger").dive();
            deleteLink.simulate("click");
            expect(removeSpy.mock.calls.length).toBe(1);
            expect(removeSpy.mock.calls[0][0]).toEqual("group1");
            expect(removeSpy.mock.calls[0][1]).toEqual(testUser.username);
        });

    });

});
