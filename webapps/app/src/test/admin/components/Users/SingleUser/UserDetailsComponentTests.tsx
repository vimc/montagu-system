import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import { Provider } from "react-redux";

import {mockUser} from "../../../../mocks/mockModels";
import {alt} from "../../../../../main/shared/alt";

import { UserDetailsContentComponent, UserDetailsContent } from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import { AddRoles } from "../../../../../main/admin/components/Users/SingleUser/AddRoles";
import { reduxHelper } from "../../../../reduxHelper";

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
        const store = reduxHelper.createAdminUserStore();
        shallow(<Provider store={store}><UserDetailsContentComponent ready={true} user={user} roles={[]} /></Provider>);
    });

    it("show add role widget if logged in user has roles.write permission", () => {
        const user = mockUser({username: "tets.user"});
        const result = shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} permissions={["*/can-login", "*/roles.write"]} />);

        expect(result.find(AddRoles).length).to.eq(1)
    });

    it("does not show add role widget if logged in user does not have roles.write permission", () => {
        const user = mockUser({username: "tets.user"});

        const result = shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} permissions={["*/can-login"]} />);

        expect(result.find(AddRoles).length).to.eq(0)
    });
});