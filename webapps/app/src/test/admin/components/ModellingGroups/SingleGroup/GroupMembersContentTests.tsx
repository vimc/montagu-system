import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {GroupMembersContentComponent} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/GroupMembersContent";
import {mockModellingGroupDetails, mockUser} from "../../../../mocks/mockModels";
import {alt} from "../../../../../main/shared/alt";
import {ListOfUsers} from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";
import {AddMember} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/AddMember";

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
            AdminAuthStore: {
                permissions: ["*/modelling-groups.manage-members"]
            }
        }));
        const props = GroupMembersContentComponent.getPropsFromStores();
        expect(props).to.eql({
            groupId: "group1",
            ready: true,
            users: [a, b, c],
            members: [a, b],
            isAdmin: true
        });
    });

    it("renders no members if group has no members", () => {
        const rendered = shallow(<GroupMembersContentComponent isAdmin={false} ready={ true } groupId="group1" users={ [] } members={ [] } />);
        expect(rendered.text()).to.contain("This group does not have any members.");
    });

    it("renders members if group has members", () => {
        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupMembersContentComponent isAdmin={false} ready={ true } groupId="group1" users={ [] } members={ members } />);
        expect(rendered.find(ListOfUsers).prop("users")).to.eql(members);
    });

    it("does not render add members if user does not have manage members permission", () => {

        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupMembersContentComponent isAdmin={false} ready={ true } groupId="group1" users={ [] } members={ members } />);
        expect(rendered.find(AddMember).length).to.eql(0);
    });

    it("renders add members if user has manage members permission", () => {

        const members = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupMembersContentComponent isAdmin={true} ready={ true } groupId="group1" users={ [] } members={ members } />);
        expect(rendered.find(AddMember).length).to.eql(1);
    });
});