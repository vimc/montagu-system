import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import { Provider } from "react-redux";

import {mockUser} from "../../../../mocks/mockModels";
import {alt} from "../../../../../main/shared/alt";

import { UserDetailsContentComponent, mapStateToProps } from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";
import { AddRoles } from "../../../../../main/admin/components/Users/SingleUser/AddRoles";
import { reduxHelper } from "../../../../reduxHelper";
import { mockAdminState } from "../../../../mocks/mockStates";

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
        shallow(<Provider store={store}><UserDetailsContentComponent ready={true} user={user} roles={[]} isAdmin={true} /></Provider>);
    });

    it("show add role widget if logged in user has is admin permission", () => {
        const user = mockUser({username: "tets.user"});
        const result = shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} isAdmin={true} />);
        expect(result.find(AddRoles).length).to.eq(1)
    });

    it("show add role widget if logged in user has admin permission", () => {
        const user = mockUser({username: "tets.user"});
        const result = shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} isAdmin={true} />);
        expect(result.find(AddRoles).length).to.eq(1)
    });

    it("maps isAdmin property true if auth state has roles.write", () => {
        const adminStateMock = mockAdminState({ auth: {permissions: ["*/roles.write"]} })
        const props = mapStateToProps(adminStateMock)
        expect(props.isAdmin).to.eq(true);
    });

    it("maps isAdmin property false if auth state has no roles.write", () => {
        const adminStateMock = mockAdminState({ auth: {permissions: []} })
        const props = mapStateToProps(adminStateMock);
        expect(props.isAdmin).to.eq(false);
    });

    it("does not show add role widget if logged in user is not admin", () => {
        const user = mockUser({username: "tets.user"});
        const result = shallow(<UserDetailsContentComponent ready={true} user={user} roles={[]} isAdmin={false} />);
        expect(result.find(AddRoles).length).to.eq(0)
    });
});