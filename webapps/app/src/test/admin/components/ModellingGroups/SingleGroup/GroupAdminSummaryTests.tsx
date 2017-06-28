import * as React from "react";
import { expect } from "chai";
import { mockModellingGroupDetails, mockUser } from "../../../../mocks/mockModels";
import { shallow } from "enzyme";
import { GroupAdminSummary } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/GroupAdminSummary";
import { InternalLink } from "../../../../../main/shared/components/InternalLink";
import { ListOfUsers } from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";

describe("GroupAdminSummary", () => {
    it("renders no admins if group has no admins", () => {
        const group = mockModellingGroupDetails({ id: "group-id", admins: [] });
        const users = [ mockUser() ];
        const rendered = shallow(<GroupAdminSummary group={ group } allUsers={ users } />);
        expect(rendered.text()).to.contain("This group does not have an admin");
        expect(rendered.find(InternalLink).prop("href")).to.equal("/modelling-groups/group-id/admin/");
    });

    it("renders admins if group has admins", () => {
        const users = [
            mockUser({ username: "test.a" }),
            mockUser({ username: "test.b" }),
        ];
        const group = mockModellingGroupDetails({ admins: [ "test.a", "test.b" ] });
        const rendered = shallow(<GroupAdminSummary group={ group } allUsers={ users } />);
        expect(rendered.find(ListOfUsers).prop("users")).to.eql(users);
    });
});