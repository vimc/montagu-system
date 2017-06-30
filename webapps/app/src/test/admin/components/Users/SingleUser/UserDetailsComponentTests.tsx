import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {mockUser} from "../../../../mocks/mockModels";
import {alt} from "../../../../../main/shared/alt";

import { UserDetailsContentComponent } from "../../../../../main/admin/components/Users/SingleUser/UserDetailsContent";

describe("UserDetailsComponent", () => {
    it("can get props from stores", () => {
        const user = mockUser();
        alt.bootstrap(JSON.stringify({
            UserStore: {
                currentUsername: "testuser",
                usersLookup: {
                    "testuser": user,
                }
            }
        }));

        expect(UserDetailsContentComponent.getPropsFromStores()).to.eql({
            ready: true,
            user: user
        });
    });

    it("can render", () => {
        const user = mockUser({username: "tets.user"});
        shallow(<UserDetailsContentComponent ready={true} user={user}/>);
    });
});