import * as React from "react";
import {expect} from "chai";
import {shallow, mount} from "enzyme";

import "../../../../../helper";
import {
    GroupMembersContentComponent,
    GroupMembersContent,
    GroupMembersListComponent, AddGroupMembersComponent
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/GroupMembersContent";
import {mockModellingGroupDetails, mockUser} from "../../../../../mocks/mockModels";
import {ListOfUsers} from "../../../../../../main/admin/components/ModellingGroups/ListOfUsers";
import {AddMember} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/AddMember";
import {Sandbox} from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";


describe("GroupMembersContent component tests", () => {

    const testUser = mockUser();
    const testUser2 = mockUser();

    describe("Connected", () => {

        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        it("connect level, can edit, there are members", () => {
            const testGroupDetails = mockModellingGroupDetails({members: [testUser.username]});
            const testState = {
                auth: { permissions: ["*/modelling-groups.manage-members"]},
                groups: { currentGroupDetails: testGroupDetails },
                users: { users: [testUser, testUser2]},

            }
            const store = createMockStore(testState);

            const rendered = shallow(<GroupMembersContent/>, {context: {store}});
            expect(rendered.props().members).to.eql([testUser]);
            expect(rendered.props().users).to.eql([testUser, testUser2]);
            expect(rendered.props().groupId).to.equal(testGroupDetails.id);
            expect(rendered.props().canManageGroupMembers).to.be.true;
        });

        it("connect level, can not edit, there are no members", () => {
            const testGroupDetails = mockModellingGroupDetails({members: []});
            const testState = {
                auth: { permissions: ["test"]},
                groups: { currentGroupDetails: testGroupDetails },
                users: { users: [testUser, testUser2]},

            }
            const store = createMockStore(testState);

            const rendered = shallow(<GroupMembersContent/>, {context: {store}});
            expect(rendered.props().members).to.eql([]);
            expect(rendered.props().users).to.eql([testUser, testUser2]);
            expect(rendered.props().groupId).to.equal(testGroupDetails.id);
            expect(rendered.props().canManageGroupMembers).to.be.false;
        });

    });

    describe("Component", () => {

        it("passes no members to members list if group has no members", () => {
            const rendered = shallow(<GroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [] }
                members={ [] }
            />);
            const membersList = rendered.find(GroupMembersListComponent);
            expect(membersList.props().members).to.eql([]);
            expect(membersList.props().groupId).to.equal("group1");
        });

        it("passes members to members list if group has members", () => {
            const rendered = shallow(<GroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [] }
                members={ [testUser] }
            />);
            const membersList = rendered.find(GroupMembersListComponent);
            expect(membersList.props().members).to.eql([testUser]);
        });

        it("passes cannot edit to add members component", () => {
            const rendered = shallow(<GroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [testUser] }
                members={ [] }
            />);
            const addMembers = rendered.find(AddGroupMembersComponent);
            expect(addMembers.props().canManageGroupMembers).to.be.false;
            expect(addMembers.props().groupId).to.equal("group1");
            expect(addMembers.props().users).to.eql([testUser]);
        });

        it("passes can edit to add members, has members and users", () => {
            const rendered = shallow(<GroupMembersContentComponent
                canManageGroupMembers={true}
                groupId="group1"
                users={ [testUser, testUser2] }
                members={ [testUser] }
            />);
            const addMembers = rendered.find(AddGroupMembersComponent);
            expect(addMembers.props().canManageGroupMembers).to.be.true;
            expect(addMembers.props().users).to.eql([testUser, testUser2]);
            expect(addMembers.props().members).to.eql([testUser]);
        });

    });

});

describe("GroupMembersListComponent component tests", () => {
    it("renders no members if group has no members", () => {
        const rendered = shallow(<GroupMembersListComponent
            groupId="group1"
            members={ [] }
        />);
        expect(rendered.text()).to.equal("This group does not have any members.");
    });

    it("renders members if group has members", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupMembersListComponent
            groupId="group1"
            members={ members } />);
        expect(rendered.find(ListOfUsers).prop("users")).to.eql(members);
    });
});

describe("AddGroupMembersComponent component tests", () => {
    it("does not render add members if user does not have manage members permission", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<AddGroupMembersComponent
            canManageGroupMembers={false}
            groupId="group1"
            users={ [] }
            members={ members }
        />);
        expect(rendered.find(AddMember).length).to.eql(0);
    });

    it("renders add members if user has manage members permission", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<AddGroupMembersComponent
            canManageGroupMembers={true}
            groupId="group1"
            users={ [] }
            members={ members }
        />);
        expect(rendered.find(AddMember).length).to.eql(1);
    });

});

