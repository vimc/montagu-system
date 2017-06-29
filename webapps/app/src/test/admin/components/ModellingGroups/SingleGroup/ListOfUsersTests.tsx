import * as React from "react";
import { expect } from "chai";
import { ListOfUsers } from "../../../../../main/admin/components/ModellingGroups/ListOfUsers";
import { mockUser } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";

describe("ListOfUsers", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders users' full names with commas in between", () => {
        const users = [
            mockUser({ "name": "Wolfgang Amadeus Mozart" }),
            mockUser({ "name": "Johann Sebastian Bach" }),
            mockUser({ "name": "Ludvig van Beethoven" }),
        ];
        const rendered = sandbox.mount(<ListOfUsers users={ users } />);
        expect(rendered.text()).to.contain("Wolfgang Amadeus Mozart, Johann Sebastian Bach, Ludvig van Beethoven");
    })
});