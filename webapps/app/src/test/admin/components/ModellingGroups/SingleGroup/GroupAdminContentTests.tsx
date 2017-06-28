import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { GroupAdminContentComponent } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Admin/GroupAdminContent";
import { mockModellingGroupDetails, mockUser } from "../../../../mocks/mockModels";
import { alt } from "../../../../../main/shared/alt";
import { User } from "../../../../../main/shared/models/Generated";
import { ListOfUsers } from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";

describe("GroupAdminContent", () => {
    it("can get props from stores", () => {
        const group = mockModellingGroupDetails();
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
                    "group2": mockModellingGroupDetails({ admins: ["a", "b"] })
                }
            }
        }));
        const props = GroupAdminContentComponent.getPropsFromStores();
        expect(props).to.eql({
            ready: true,
            users: [a, b, c],
            admins: new Set<User>([a, b])
        });
    });

    it("renders no admins if group has no admins", () => {
        const rendered = shallow(<GroupAdminContentComponent ready={ true } users={ [] } admins={ new Set() } />);
        expect(rendered.text()).to.contain("This group does not have an admin");
    });

    it("renders admins if group has admins", () => {
        const admins = [
            mockUser({ name: "Test A" }),
            mockUser({ name: "Test B" })
        ];
        const rendered = shallow(<GroupAdminContentComponent ready={ true } users={ [] } admins={ new Set(admins) } />);
        expect(rendered.find(ListOfUsers).prop("users")).to.eql(admins);
    });
});