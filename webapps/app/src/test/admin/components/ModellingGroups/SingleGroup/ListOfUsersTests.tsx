import * as React from "react";
import { expect } from "chai";
import { Provider } from "react-redux";

import { ListOfUsers } from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";
import { mockUser } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { DeletableUser } from "../../../../../main/admin/components/ModellingGroups/DeletableUser";
import { reduxHelper } from "../../../../reduxHelper";

describe("ListOfUsers", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders users alphabetically", () => {
        const users = [
            mockUser({ "name": "Wolfgang Amadeus Mozart" }),
            mockUser({ "name": "Johann Sebastian Bach" }),
            mockUser({ "name": "Ludvig van Beethoven" }),
        ];

        const store = reduxHelper.createAdminUserStore();
        const rendered = sandbox.mount(<Provider store={store}><ListOfUsers groupId="group1" users={users}/></Provider>);
        const elements = rendered.find(DeletableUser);
        expect(elements).to.have.length(3);
        const names = elements.getElements().map(e => e.props.user.name);
        expect(names).to.eql([
            "Johann Sebastian Bach",
            "Ludvig van Beethoven",
            "Wolfgang Amadeus Mozart"
        ]);
    });


    it("does not show delete if user does not have manage.members permission", () => {
        const users = [
            mockUser({ "name": "Wolfgang Amadeus Mozart" })
        ];

        const store = reduxHelper.createStore({auth: {permissions:["*/can-login"]}});

        const rendered = sandbox.mount(<Provider store={store}><ListOfUsers groupId="group1" users={users}/></Provider>);
        expect(rendered.find(DeletableUser).first().prop("showDelete")).to.eq(false);
    })
});