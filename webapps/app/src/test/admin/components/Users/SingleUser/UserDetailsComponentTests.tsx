import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {mockUser} from "../../../../mocks/mockModels";
import {alt} from "../../../../../main/shared/alt";

import { UserDetailsContentComponent } from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import { AddRoles } from "../../../../../main/admin/components/Users/SingleUser/AddRoles";

describe("UserDetailsComponent", () => {
    it("can get props from stores", () => {
        const user = mockUser();
        alt.bootstrap(JSON.stringify({
            UserStore: {
                currentUsername: "testuser",
                usersLookup: {
                    "testuser": user,
                },
                rolesLookup: {
                    "testuser": []
                }
            }
        }));

        expect(UserDetailsContentComponent.getPropsFromStores()).to.eql({
            ready: true,
            user: user,
            roles: []
        });
    });

    it("can render", () => {
        const user = mockUser({username: "tets.user"});
        shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} />);
    });

    it("show add role widget if logged in user has roles.write permission", () => {
        const user = mockUser({username: "tets.user"});
        alt.bootstrap(JSON.stringify({
            AdminAuthStore: {
                permissions: ["*/can-login", "*/roles.write"]
            }
        }));

        const result = shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} />);

        expect(result.find(AddRoles).length).to.eq(1)
    });

    it("does not show add role widget if logged in user does not have roles.write permission", () => {
        const user = mockUser({username: "tets.user"});
        alt.bootstrap(JSON.stringify({
            AdminAuthStore: {
                permissions: ["*/can-login"]
            }
        }));

        const result = shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} />);

        expect(result.find(AddRoles).length).to.eq(0)
    });
});