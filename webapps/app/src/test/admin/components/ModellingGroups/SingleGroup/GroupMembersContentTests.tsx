import * as React from "react";
import {expect} from "chai";
import {shallow, mount} from "enzyme";

import {GroupMembersContentComponent, GroupMembersContent} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/GroupMembersContent";
import {mockModellingGroupDetails, mockUser} from "../../../../mocks/mockModels";
import {alt} from "../../../../../main/shared/alt";
import {ListOfUsers} from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";
import {AddMember} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/AddMember";
import { mockAdminState } from "../../../../mocks/mockStates";
import {mapStateToProps} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/GroupMembersContent";


describe("GroupMembersContent", () => {

    afterEach(() => {
        alt.recycle();
    });

    it("can get props from stores", () => {
        const group = mockModellingGroupDetails({id: "group1", members: ["a", "b"] });
        const a = mockUser({ username: "a" });
        const b = mockUser({ username: "b" });
        const c = mockUser({ username: "c" });
        alt.bootstrap(JSON.stringify({
            UserStore: {
                users: [a, b, c],
                ready: true
            },
            GroupStore: {
                currentGroupId: "group1",
                groupDetails: {
                    "group1": group,
                    "group2": mockModellingGroupDetails()
                },
                membersLookup: {"group1": ["a", "b"], "group2": []}
            },
        }));
        const props = GroupMembersContentComponent.getPropsFromStores();
        expect(props).to.eql({
            groupId: "group1",
            ready: true,
            users: [a, b, c],
            members: [a, b],
        });
    });

    it("checks if user can manage groups if has permission", () => {
        const adminStateMock = mockAdminState({ auth: {permissions: ['*/modelling-groups.manage-members']} })
        const props = mapStateToProps(adminStateMock);
        expect(props.canManageGroupMembers).to.eq(true);
    });

    it("checks if user can manage groups if has permission", () => {
        const adminStateMock = mockAdminState({ auth: {permissions: ['']} })
        const props = mapStateToProps(adminStateMock);
        expect(props.canManageGroupMembers).to.eq(false);
    });

    it("renders no members if group has no members", () => {
        const rendered = shallow(<GroupMembersContentComponent canManageGroupMembers={false} ready={ true } groupId="group1" users={ [] } members={ [] } />);
        expect(rendered.text()).to.contain("This group does not have any members.");
    });

    it("renders members if group has members", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupMembersContentComponent canManageGroupMembers={false} ready={ true } groupId="group1" users={ [] } members={ members } />);
        expect(rendered.find(ListOfUsers).prop("users")).to.eql(members);
    });

    it("does not render add members if user does not have manage members permission", () => {

        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupMembersContentComponent canManageGroupMembers={false} ready={ true } groupId="group1" users={ [] } members={ members } />);
        expect(rendered.find(AddMember).length).to.eql(0);
    });

    it("renders add members if user has manage members permission", () => {

        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupMembersContentComponent canManageGroupMembers={true} ready={ true } groupId="group1" users={ [] } members={ members } />);
        expect(rendered.find(AddMember).length).to.eql(1);
    });
});