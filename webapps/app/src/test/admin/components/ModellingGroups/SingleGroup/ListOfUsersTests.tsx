import * as React from "react";
import { expect } from "chai";
import { DeletableUser, ListOfUsers } from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";
import { mockUser } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { RemoveLink } from "../../../../../main/shared/components/RemoveLink";
import { InternalLink } from "../../../../../main/shared/components/InternalLink";

describe("ListOfUsers", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders users", () => {
        const users = [
            mockUser({ "name": "Wolfgang Amadeus Mozart" }),
            mockUser({ "name": "Johann Sebastian Bach" }),
            mockUser({ "name": "Ludvig van Beethoven" }),
        ];
        const rendered = sandbox.mount(<ListOfUsers groupId="group1" users={ users } />);
        expect(rendered.find(DeletableUser).length).to.eq(3)
    })
});

describe("DeletableUser", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders link to user page", () => {

        const rendered = sandbox.mount(<DeletableUser groupId="group1" user={  mockUser({ "username": "w.a.m", "name": "Wolfgang Amadeus Mozart" }) } />);
        expect(rendered.find(InternalLink).prop("href")).to.eq("/users/w.a.m/")
    });

    it("renders delete link", () => {

        const rendered = sandbox.mount(<DeletableUser groupId="group1" user={  mockUser({ "name": "Wolfgang Amadeus Mozart" }) } />);
        expect(rendered.find(RemoveLink).prop("text")).to.eq("Remove member")
    })
});