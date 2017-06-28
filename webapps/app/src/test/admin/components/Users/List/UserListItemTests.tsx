import * as React from "react";
import { shallow } from "enzyme";
import {UserListItem} from "../../../../../main/admin/components/Users/List/UserListItem";
import {mockUser} from "../../../../mocks/mockModels";

describe("UserListItem", () => {
    it("can render", () => {
        shallow(<UserListItem { ...mockUser() } />);
    });
});