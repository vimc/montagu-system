import * as React from "react";
import { expect } from "chai";
import { checkAsync } from "../../../../testHelpers";
import { AddRoles } from "../../../../../main/admin/components/Users/SingleUser/AddRoles";
import { Sandbox } from "../../../../Sandbox";
import fetcher from "../../../../../main/shared/sources/Fetcher";
import { mockResponse } from "../../../../mocks/mockRemote";
import { expectOneAction } from "../../../../actionHelpers";
import { shallow } from "enzyme";

describe("AddRoles", () => {

    let sandbox: Sandbox;

    beforeEach(() => {
        sandbox = new Sandbox()
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("populates role options", (done: DoneCallback) => {


        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .returns(mockResponse({ status: "success", data: ["role1", "role2"], errors: [] }));

        const roles = shallow(<AddRoles username={"testuser"} userRoles={[]}/>);
        const instance = roles.instance();
        const setState = sandbox.sinon.stub(instance, 'setState')
            .withArgs({roles: ["role1", "role2"], selectedRole: "role1"});

        instance.componentWillMount();

        checkAsync(done, afterWait => {
            expect(fetch.called).to.equal(true);

            afterWait(done, () => {
                expect(setState.called).to.equal(true);
            })

        })
    });

    it("only shows roles the user does not have", (done: DoneCallback) => {

        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .returns(mockResponse({ status: "success", data: ["role1", "role2"], errors: [] }));

        const roles = sandbox.mount(<AddRoles username={"testuser"} userRoles={["role1"]}/>);
         const instance = roles.instance();
        const setState = sandbox.sinon.stub(instance, 'setState')
            .withArgs({roles: ["role2"], selectedRole: "role2"});

        instance.componentWillMount();

        checkAsync(done, afterWait => {
            expect(fetch.called).to.equal(true);

            afterWait(done, () => {
                expect(setState.called).to.equal(true);
            })
        })
    });

    it("notifies on error", (done: DoneCallback) => {

        const fakeError = { code: "e1", message: "some error" };
        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .returns(mockResponse({ status: "failure", data: null, errors: [fakeError] }));

        const dispatchSpy = sandbox.dispatchSpy();

        sandbox.mount(<AddRoles username={"testuser"} userRoles={["role1"]}/>);

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(fetch.called).to.equal(true);
                expectOneAction(dispatchSpy, {
                    action: "NotificationActions.notify",
                    payload: { type: "error", message: fakeError.message }
                });
            })
        })
    });

    it("adds role", (done: DoneCallback) => {

        const sandbox = new Sandbox();
        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .withArgs("/users/roles/all/")
            .returns(mockResponse({ status: "success", data: ["role1", "role2"], errors: [] }));

        fetch
            .withArgs("/users/testuser/actions/associate_role/",
                {
                    method: "post",
                    body: JSON.stringify({ name: "rolename", action: "add", scope_prefix: null, scope_id: null })
                }
            )
            .returns(mockResponse({ status: "success", data: "OK", errors: [] }));

        const dispatchSpy = sandbox.dispatchSpy();

        const addRoles = sandbox.mount(<AddRoles username={"testuser"} userRoles={["role1"]}/>);
        addRoles.setState({ selectedRole: "rolename", roles: ["rolename"] });

        const onClick = addRoles.find("button").prop("onClick");
        onClick.call(onClick, {
            preventDefault: () => {
            }
        });

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(fetch.called).to.equal(true);
                expectOneAction(dispatchSpy, {
                    action: "UserActions.addRole",
                    payload: { name: "rolename", scope_prefix: null, scope_id: null }
                });
                sandbox.restore()
            })
        })
    })
});