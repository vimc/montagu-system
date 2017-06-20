import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { GroupAdminContentComponent } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Admin/GroupAdminContent";
import { mockModellingGroupDetails } from "../../../../mocks/mockModels";
import { alt } from "../../../../../main/shared/alt";

describe("GroupAdminContent", () => {
    it("can get props from stores", () => {
        const group = mockModellingGroupDetails();
        alt.bootstrap(JSON.stringify({
            GroupStore: {
                currentGroupId: "group1",
                groupDetails: {
                    "group1": group,
                    "group2": mockModellingGroupDetails()
                }
            }
        }));
        const props = GroupAdminContentComponent.getPropsFromStores();
        expect(props).to.eql({
            ready: true,
            group: group
        });
    });

    it("renders no admins if group has no admins", () => {
        const group = mockModellingGroupDetails({ admins: [] });
        const rendered = shallow(<GroupAdminContentComponent ready={ true } group={ group } />);
        expect(rendered.text()).to.contain("This group does not have an admin");
    });

    it("renders admins if group has admins", () => {
        const group = mockModellingGroupDetails({ admins: [ "test.a", "test.b" ] });
        const rendered = shallow(<GroupAdminContentComponent ready={ true } group={ group } />);
        expect(rendered.text()).to.contain("test.a, test.b");
    });
});