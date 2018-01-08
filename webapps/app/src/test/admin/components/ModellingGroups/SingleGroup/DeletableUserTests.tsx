import * as React from "react";
import { expect } from "chai";
import { mockUser } from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import { InternalLink } from "../../../../../main/shared/components/InternalLink";
import { checkAsync } from "../../../../testHelpers";
import { User } from "../../../../../main/shared/models/Generated";
import fetcher from "../../../../../main/shared/sources/Fetcher";
import { mockResponse } from "../../../../mocks/mockRemote";
import { expectOneAction } from "../../../../actionHelpers";
import { DeletableUser } from "../../../../../main/admin/components/ModellingGroups/DeletableUser";
import { Link } from "simple-react-router";


describe("DeletableUser", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("renders link to user page", () => {

        const rendered = sandbox.mount(<DeletableUser showDelete={true} groupId="group1" user={mockUser({
            "username": "w.a.m",
            "name": "Wolfgang Amadeus Mozart"
        })}/>);
        expect(rendered.find(InternalLink).prop("href")).to.eq("/users/w.a.m/")
    });

    it("renders delete link", () => {
        const rendered = sandbox.mount(<DeletableUser showDelete={true} groupId="group1"
                                                      user={mockUser({ "name": "Wolfgang Amadeus Mozart" })}/>);
        expect(rendered.find("a.text-danger").text()).to.eq("Remove member")
    });

    it("does not render delete link if showDelete is false", () => {

        const rendered = sandbox.mount(<DeletableUser showDelete={false} groupId="group1"
                                                      user={mockUser({ "name": "Wolfgang Amadeus Mozart" })}/>);
        expect(rendered.find(".text-danger").length).to.eq(0)
    });

    it("removes member", (done: DoneCallback) => {

        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .withArgs("/modelling-groups/group1/actions/associate-member/",
                {
                    method: "post",
                    body: JSON.stringify({ username: "user1", action: "remove" })
                }
            )
            .returns(mockResponse({ status: "success", data: "OK", errors: [] }));

        const dispatchSpy = sandbox.dispatchSpy();

        const user: User = mockUser({ "name": "Wolfgang Amadeus Mozart", "username": "user1" });

        const deletableUser = new DeletableUser({ showDelete: true, groupId: "group1", user: user });
        deletableUser.clickHandler();

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(fetch.called).to.equal(true);
                expectOneAction(dispatchSpy, { action: "ModellingGroupActions.removeMember", payload: "user1" });
            })
        })
    });

    it("notifies on error", (done: DoneCallback) => {

        const fakeError = { code: "e1", message: "some error" };
        const fetch = sandbox.sinon.stub(fetcher.fetcher, "fetch")
            .withArgs("/modelling-groups/group1/actions/associate-member/",
                {
                    method: "post",
                    body: JSON.stringify({ username: "user1", action: "remove" })
                }
            )
            .returns(mockResponse({ status: "failure", data: null, errors: [fakeError] }));

        const dispatchSpy = sandbox.dispatchSpy();

        const user: User = mockUser({ "name": "Wolfgang Amadeus Mozart", "username": "user1" });

        const deletableUser = new DeletableUser({ showDelete: true, groupId: "group1", user: user });
        deletableUser.clickHandler();

        checkAsync(done, afterWait => {
            afterWait(done, () => {
                expect(fetch.called).to.equal(true);
                expectOneAction(dispatchSpy, {
                    action: "NotificationActions.notify",
                    payload: { type: "error", message: fakeError.message }
                });
            })
        })
    })
});