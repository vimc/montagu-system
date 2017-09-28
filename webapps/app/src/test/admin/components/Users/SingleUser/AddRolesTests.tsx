import * as React from "react";
import {expect} from "chai";
import { checkAsync } from "../../../../testHelpers";
import { AddRoles } from "../../../../../main/admin/components/Users/SingleUser/AddRoles";
import { Sandbox } from "../../../../Sandbox";
import fetcher from "../../../../../main/shared/sources/Fetcher";
import { mockResponse } from "../../../../mocks/mockRemote";

describe("AddRoles", () => {

    it("populates role options", (done: DoneCallback) => {

        const sandbox = new Sandbox();
        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .returns(mockResponse({status: "success", data: ["role1", "role2"], errors: []}));
        const roles = sandbox.mount(<AddRoles username={"testuser"} userRoles={[]}/>);

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(roles.find(".form-control").children().length).to.eq(2)
            })
        })
    });

    it("only shows role the user does not have", (done: DoneCallback) => {
        const sandbox = new Sandbox();
        
        const roles = sandbox.mount(<AddRoles username={"testuser"} userRoles={["role1"]}/>);

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(roles.find(".form-control").children().length).to.eq(1)
            })
        })
    })
});