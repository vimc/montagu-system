import * as React from "react";
import {shallow} from "enzyme";

import {UserListItem} from "../../../../../main/admin/components/Users/List/UserListItem";
import {mockRole, mockUser} from "../../../../mocks/mockModels";
import {User} from "../../../../../main/shared/models/APITypes";

describe("UserListItem", () => {
    it("can render", () => {
        shallow(<UserListItem {...mockUser()} />);
    });

    it("shows 'never' if user has not logged in", () => {
        const user: User = mockUser();
        user.last_logged_in = null;
        const rendered = shallow(<UserListItem {...user} />);
        const cells = rendered.find('td');

        const lastLoggedIn = cells.at(3).text();
        expect(lastLoggedIn).toEqual("never")
    });

    it("shows 'inactive' if user does not have user role", () => {
        const user: User = mockUser({roles: []});
        user.last_logged_in = null;
        const rendered = shallow(<UserListItem {...user} />);
        const cells = rendered.find('td');

        const active = cells.at(4);
        expect(active.text()).toEqual("inactive");
        expect(active.hasClass("text-danger")).toBe(true);
    });


    it("does not show 'inactive' if user has user role", () => {
        const user: User = mockUser({roles: [mockRole({name: "user"})]});
        user.last_logged_in = null;
        const rendered = shallow(<UserListItem {...user} />);
        const cells = rendered.find('td');

        const active = cells.at(4);
        expect(active.text()).toEqual("");
        expect(active.hasClass("text-danger")).toBe(false);
    });

});
