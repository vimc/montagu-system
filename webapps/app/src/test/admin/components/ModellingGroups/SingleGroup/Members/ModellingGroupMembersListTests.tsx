import * as React from "react";

import { shallow } from "enzyme";

import "../../../../../helper";
import {
    ModellingGroupMembersList,
    ModellingGroupMembersListComponent
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersList";
import { mockUser } from "../../../../../mocks/mockModels";
import { Sandbox } from "../../../../../Sandbox";
import { ModellingGroupMembersDeletableUser } from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersDeletableUser";
import {createMockStore} from "../../../../../mocks/mockStore";

describe("Modelling Group Members List component tests", () => {

    const testUser = mockUser({name: "b"});
    const testUser2 = mockUser({name: "a"});
    const testUser3 = mockUser({name: "c"});

    describe("Connected", () => {

        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        it("connect level, there are users and can manage", () => {
            const testState = {
                auth: { canManageGroupMembers: true},
            };
            const store = createMockStore(testState);

            const rendered = shallow(<ModellingGroupMembersList
                users={[testUser]}
                groupId={"g-1"}
            />, {context: {store}});
            expect(rendered.props().users).toEqual([testUser]);
            expect(rendered.props().groupId).toEqual("g-1");
            expect(rendered.props().isAdmin).toBe(true);
        });

        it("connect level, there are no users and can not manage", () => {
            const testState = {
                auth: { canManageGroupMembers: false },
            };
            const store = createMockStore(testState);

            const rendered = shallow(<ModellingGroupMembersList
                users={[]}
                groupId={"g-1"}
            />, {context: {store}});
            expect(rendered.props().users).toEqual([]);
            expect(rendered.props().groupId).toEqual("g-1");
            expect(rendered.props().isAdmin).toBe(false);
        });

        it("connect level, there are users and they are sorted", () => {
            const testState = {
                auth: {permissions: ["*/modelling-groups.manage-members"]},
            };
            const store = createMockStore(testState);

            const rendered = shallow(<ModellingGroupMembersList
                users={[testUser, testUser2, testUser3]}
                groupId={"g-1"}
            />, {context: {store}});
            expect(rendered.props().users).toEqual([testUser2, testUser, testUser3]);
        });
    });

    describe("Component", () => {
        it("renders messages no users if null is passed for users", () => {
            const rendered = shallow(<ModellingGroupMembersListComponent
                users={null}
                groupId={"g-1"}
                isAdmin={false}
            />);
            expect(rendered.text()).toEqual("This group does not have any members.");
        });

        it("renders messages no users if empty array is passed for users", () => {
            const rendered = shallow(<ModellingGroupMembersListComponent
                users={[]}
                groupId={"g-1"}
                isAdmin={false}
            />);
            expect(rendered.text()).toEqual("This group does not have any members.");
        });

        it(
            "renders passed users as deletable user components but cannot edit",
            () => {
                const rendered = shallow(<ModellingGroupMembersListComponent
                    users={[testUser, testUser2]}
                    groupId={"g-1"}
                    isAdmin={false}
                />);
                const deletableUsers = rendered.find(ModellingGroupMembersDeletableUser);
                expect(deletableUsers.length).toEqual(2);
                expect(deletableUsers.at(0).props().user).toEqual(testUser);
                expect(deletableUsers.at(0).props().showDelete).toBe(false);
            }
        );

        it("renders passed users as deletable user components and can edit", () => {
            const rendered = shallow(<ModellingGroupMembersListComponent
                users={[testUser, testUser2]}
                groupId={"g-1"}
                isAdmin={true}
            />);
            const deletableUsers = rendered.find(ModellingGroupMembersDeletableUser);
            expect(deletableUsers.length).toEqual(2);
            expect(deletableUsers.at(0).props().user).toEqual(testUser);
            expect(deletableUsers.at(0).props().showDelete).toBe(true);
        });

    });

});
