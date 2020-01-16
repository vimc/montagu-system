import * as React from "react";

import {shallow} from "enzyme";

import "../../../../../helper";
import {
    ModellingGroupMembersContentComponent,
    ModellingGroupMembersContent,
    AddGroupMembersComponent
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersContent";
import {mockModellingGroupDetails, mockUser} from "../../../../../mocks/mockModels";
import {ModellingGroupMembersList} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersList";
import {ModellingGroupMembersAdd} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersAdd";
import {Sandbox} from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";


describe("Modelling Group Members Content component tests", () => {

    const testUser = mockUser();
    const testUser2 = mockUser();

    describe("Connected", () => {

        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        it("connect level, can edit, there are members", () => {
            const testGroupDetails = mockModellingGroupDetails({members: [testUser.username]});
            const testState = {
                auth: { permissions: ["*/modelling-groups.manage-members"]},
                groups: { currentGroupDetails: testGroupDetails, currentGroupMembers: [testUser] },
                users: { users: [testUser, testUser2]},
            };
            const store = createMockStore(testState);

            const rendered = shallow(<ModellingGroupMembersContent/>, {context: {store}});
            expect(rendered.props().members).toEqual([testUser]);
            expect(rendered.props().users).toEqual([testUser, testUser2]);
            expect(rendered.props().members).toEqual([testUser]);
            expect(rendered.props().groupId).toEqual(testGroupDetails.id);
            expect(rendered.props().canManageGroupMembers).toBe(true);
        });

        it("connect level, can not edit, there are no members", () => {
            const testGroupDetails = mockModellingGroupDetails({members: []});
            const testState = {
                auth: { permissions: ["test"]},
                groups: { currentGroupDetails: testGroupDetails, currentGroupMembers: [] as any},
                users: { users: [testUser, testUser2]},

            };
            const store = createMockStore(testState);

            const rendered = shallow(<ModellingGroupMembersContent/>, {context: {store}});
            expect(rendered.props().members).toEqual([]);
            expect(rendered.props().users).toEqual([testUser, testUser2]);
            expect(rendered.props().groupId).toEqual(testGroupDetails.id);
            expect(rendered.props().canManageGroupMembers).toBe(false);
        });

    });

    describe("Component", () => {

        it("passes no members to members list if group has no members", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [] }
                members={ [] }
            />);
            const membersList = rendered.find(ModellingGroupMembersList);
            expect(membersList.props().users).toEqual([]);
            expect(membersList.props().groupId).toEqual("group1");
        });

        it("passes members to members list if group has members", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [] }
                members={ [testUser] }
            />);
            const membersList = rendered.find(ModellingGroupMembersList);
            expect(membersList.props().users).toEqual([testUser]);
        });

        it("passes cannot edit to add members component", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [testUser] }
                members={ [testUser] }
            />);
            const addMembers = rendered.find(AddGroupMembersComponent);
            expect(addMembers.props().canManageGroupMembers).toBe(false);
            expect(addMembers.props().groupId).toEqual("group1");
            expect(addMembers.props().members).toEqual([testUser]);
        });

        it("passes can edit to add members, has members", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={true}
                groupId="group1"
                users={ [testUser, testUser2] }
                members={ [testUser] }
            />);
            const addMembers = rendered.find(AddGroupMembersComponent);
            expect(addMembers.props().canManageGroupMembers).toBe(true);
            expect(addMembers.props().members).toEqual([testUser]);
        });

    });

});

describe("AddGroupMembersComponent component tests", () => {
    it(
        "does not render add members if user does not have manage members permission",
        () => {
            const members = [
                mockUser({ name: "Test A" }),
                mockUser({ name: "Test B" })
            ];
            const rendered = shallow(<AddGroupMembersComponent
                canManageGroupMembers={false}
                groupId="group1"
                members={ members }
            />);
            expect(rendered.find(ModellingGroupMembersAdd).length).toEqual(0);
        }
    );

    it("renders add members if user has manage members permission", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<AddGroupMembersComponent
            canManageGroupMembers={true}
            groupId="group1"
            members={ members }
        />);
        expect(rendered.find(ModellingGroupMembersAdd).length).toEqual(1);
    });

});

