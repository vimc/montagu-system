import * as React from "react";
import { expect } from "chai";
import { mockModellingGroupDetails } from "../../../../mocks/mockModels";
import { shallow } from "enzyme";
import { GroupAdminSummary } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Details/GroupAdminSummary";
import { InternalLink } from "../../../../../main/shared/components/InternalLink";

describe("GroupAdminSummary", () => {
    it("renders no admins if group has no admins", () => {
        const group = mockModellingGroupDetails({ id: "group-id", admins: [] });
        const rendered = shallow(<GroupAdminSummary { ...group } />);
        expect(rendered.text()).to.contain("This group does not have an admin");
        expect(rendered.find(InternalLink).prop("href")).to.equal("/modelling-groups/group-id/admin/");
    });

    it("renders admins if group has admins", () => {
        const group = mockModellingGroupDetails({ admins: [ "test.a", "test.b" ] });
        const rendered = shallow(<GroupAdminSummary { ...group } />);
        expect(rendered.text()).to.contain("test.a, test.b");
    });
});