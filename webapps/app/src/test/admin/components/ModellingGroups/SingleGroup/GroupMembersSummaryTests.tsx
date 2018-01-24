import * as React from "react";
import {expect} from "chai";
import {mockModellingGroupDetails, mockUser} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {GroupMembersSummary} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/GroupMembersSummary";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("GroupMembersSummary", () => {
    it("renders no members if group has no members", () => {
        const group = mockModellingGroupDetails({id: "group-id", members: []});
        const users = [mockUser()];
        const rendered = shallow(<GroupMembersSummary group={group} allUsers={users} canEdit={false}/>);
        expect(rendered.text()).to.contain("This group does not have any members");
        expect(rendered.find(InternalLink)).to.have.length(0);
    });

    it("renders add member link if group has no members", () => {
        const group = mockModellingGroupDetails({id: "group-id", members: []});
        const users = [mockUser()];
        const rendered = shallow(<GroupMembersSummary group={group} allUsers={users} canEdit={true}/>);
        expect(rendered.find(InternalLink).prop("href")).to.equal("/modelling-groups/group-id/admin/");
    });

    it("renders members if group has members", () => {
        const users = [
            mockUser({username: "test.a"}),
            mockUser({username: "test.b"}),
        ];
        const group = mockModellingGroupDetails({members: ["test.a", "test.b"]});
        const rendered = shallow(<GroupMembersSummary group={group} allUsers={users} canEdit={false}/>);
        expect(rendered.find(InternalLink)).to.have.length(2);
        expect(rendered.find(InternalLink).first().prop("href")).to.eql("/users/test.a/");
    });

    it("renders edit members link if group has members", () => {
        const users = [
            mockUser({username: "test.a"}),
            mockUser({username: "test.b"}),
        ];
        const group = mockModellingGroupDetails({id: "group-id", members: ["test.a", "test.b"]});
        const rendered = shallow(<GroupMembersSummary group={group} allUsers={users} canEdit={true}/>);
        expect(rendered.find(InternalLink)).to.have.length(3);
        expect(rendered.find(InternalLink).last().prop("href")).to.eql("/modelling-groups/group-id/admin/");
    });
});