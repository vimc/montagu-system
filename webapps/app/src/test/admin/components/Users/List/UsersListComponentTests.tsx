import * as React from "react";
import { alt } from "../../../../../main/shared/alt";
import { expect } from "chai";
import {mockUser} from "../../../../mocks/mockModels";
import { shallow } from "enzyme";

import {UsersListComponent} from "../../../../../main/admin/components/Users/List/UsersList";
import {UserListItem} from "../../../../../main/admin/components/Users/List/UserListItem";

describe("UsersListComponent", () => {
    it("can get props from stores", () => {
        const users = [ mockUser(), mockUser() ];
        alt.bootstrap(JSON.stringify({
            UserStore: {
                ready: true,
                users: users
            }
        }));

        expect(UsersListComponent.getPropsFromStores()).to.eql({
            ready: true,
            users: users
        });
    });

    it("renders items alphabetically", () => {
        const users = [
            mockUser({ username: "z" }),
            mockUser({ username: "a" }),
            mockUser({ username: "m" })
        ];
        const rendered = shallow(<UsersListComponent ready={ true } users={ users} />);
        const items = rendered.find(UserListItem);
        expect(items).to.have.length(3);
        expect(items.at(0).prop("username")).to.equal("a");
        expect(items.at(1).prop("username")).to.equal("m");
        expect(items.at(2).prop("username")).to.equal("z");
    });
});