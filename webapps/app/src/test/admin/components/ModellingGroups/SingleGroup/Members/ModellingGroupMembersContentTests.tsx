import * as React from "react";
import {expect} from "chai";
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

        test("connect level, can edit, there are members", () => {
            const testGroupDetails = mockModellingGroupDetails({members: [testUser.username]});
            const testState = {
                auth: { permissions: ["*/modelling-groups.manage-members"]},
                groups: { currentGroupDetails: testGroupDetails, currentGroupMembers: [testUser] },
                users: { users: [testUser, testUser2]},
            };
            const store = createMockStore(testState);

            const rendered = shallow(<ModellingGroupMembersContent/>, {context: {store}});
            expect(rendered.props().members).to.eql([testUser]);
            expect(rendered.props().users).to.eql([testUser, testUser2]);
            expect(rendered.props().members).to.eql([testUser]);
            expect(rendered.props().groupId).to.equal(testGroupDetails.id);
            expect(rendered.props().canManageGroupMembers).to.be.true;
        });

        test("connect level, can not edit, there are no members", () => {
            const testGroupDetails = mockModellingGroupDetails({members: []});
            const testState = {
                auth: { permissions: ["test"]},
                groups: { currentGroupDetails: testGroupDetails, currentGroupMembers: [] as any},
                users: { users: [testUser, testUser2]},

            };
            const store = createMockStore(testState);

            const rendered = shallow(<ModellingGroupMembersContent/>, {context: {store}});
            expect(rendered.props().members).to.eql([]);
            expect(rendered.props().users).to.eql([testUser, testUser2]);
            expect(rendered.props().groupId).to.equal(testGroupDetails.id);
            expect(rendered.props().canManageGroupMembers).to.be.false;
        });

    });

    describe("Component", () => {

        test("passes no members to members list if group has no members", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [] }
                members={ [] }
            />);
            const membersList = rendered.find(ModellingGroupMembersList);
            expect(membersList.props().users).to.eql([]);
            expect(membersList.props().groupId).to.equal("group1");
        });

        test("passes members to members list if group has members", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [] }
                members={ [testUser] }
            />);
            const membersList = rendered.find(ModellingGroupMembersList);
            expect(membersList.props().users).to.eql([testUser]);
        });

        test("passes cannot edit to add members component", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={false}
                groupId="group1"
                users={ [testUser] }
                members={ [testUser] }
            />);
            const addMembers = rendered.find(AddGroupMembersComponent);
            expect(addMembers.props().canManageGroupMembers).to.be.false;
            expect(addMembers.props().groupId).to.equal("group1");
            expect(addMembers.props().members).to.eql([testUser]);
        });

        test("passes can edit to add members, has members", () => {
            const rendered = shallow(<ModellingGroupMembersContentComponent
                canManageGroupMembers={true}
                groupId="group1"
                users={ [testUser, testUser2] }
                members={ [testUser] }
            />);
            const addMembers = rendered.find(AddGroupMembersComponent);
            expect(addMembers.props().canManageGroupMembers).to.be.true;
            expect(addMembers.props().members).to.eql([testUser]);
        });

    });

});

describe("AddGroupMembersComponent component tests", () => {
    test(
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
            expect(rendered.find(ModellingGroupMembersAdd).length).to.eql(0);
        }
    );

    test("renders add members if user has manage members permission", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<AddGroupMembersComponent
            canManageGroupMembers={true}
            groupId="group1"
            members={ members }
        />);
        expect(rendered.find(ModellingGroupMembersAdd).length).to.eql(1);
    });

});

