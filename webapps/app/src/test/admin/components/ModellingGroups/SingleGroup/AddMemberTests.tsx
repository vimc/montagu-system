import {shallow} from "enzyme";
import {
    AddMember,
    AddMemberState
} from "../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/AddMember";
import * as React from "react";
import {expect} from "chai";
import {mockUser} from "../../../../mocks/mockModels";
import {mockEvent} from "../../../../mocks/mocks";
import {mockResponse, successResult} from "../../../../mocks/mockRemote";
import {Sandbox} from "../../../../Sandbox";
import {checkAsync} from "../../../../testHelpers";
import {expectOneAction} from "../../../../actionHelpers";

describe("AddMember", () => {
    const groupId = "group-1";
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("empty add member has no selected user and renders helpful message", () => {
        const rendered = shallow(<AddMember members={[]} users={[]} groupId={groupId}/>);
        const expectedState: AddMemberState = {
            selectedUser: "",
            options: []
        };
        expect(rendered.instance().state).to.eql(expectedState);
        expect(rendered.text()).to.contain("No more users available to add");
        expect(rendered.find("form")).to.have.length(0, "Expected there to be no form elements");
    });

    it("renders options alphabetically", () => {
        const a = mockUser({username: "apple"});
        const b = mockUser({username: "banana"});
        const c = mockUser({username: "clementine"});
        const rendered = shallow(<AddMember members={[]} users={[c, a, b]} groupId={groupId}/>);
        const expectedState: AddMemberState = {
            selectedUser: "apple",
            options: [a, b, c]
        };
        expect(rendered.instance().state).to.eql(expectedState);
        expect(rendered.text()).to.not.contain("No more users available to add");
        expect(rendered.find("form")).to.have.length(1, "Expected there to be 1 form element");
        expect(rendered.find("option").getElements().map(e => e.props.value)).to.eql([
            "apple",
            "banana",
            "clementine"
        ]);
    });

    it("does not show options that are already members", () => {
        const a = mockUser({username: "a"});
        const b = mockUser({username: "b"});
        const c = mockUser({username: "c"});
        const rendered = shallow(<AddMember members={["a", "c"]} users={[a, b, c]} groupId={groupId}/>);
        const expectedState: AddMemberState = {
            selectedUser: "b",
            options: [b]
        };
        expect(rendered.instance().state).to.eql(expectedState);
        expect(rendered.find("option")).to.have.length(1);
    });

    it("when user selects option, selectedUser changes state", () => {
        const a = mockUser({username: "a"});
        const b = mockUser({username: "b"});
        const rendered = shallow(<AddMember members={[]} users={[a, b]} groupId={groupId}/>);
        expect(rendered.instance().state.selectedUser).to.equal("a");
        rendered.find("select").simulate("change", { target: { value: "b" } });
        expect(rendered.instance().state.selectedUser).to.equal("b");
    });

    it("when user clicks Add, emits correct actions", (done: DoneCallback) => {
        // Mocks
        const fetch = sandbox.fetcherStub(mockResponse(successResult(true)));
        const dispatchSpy = sandbox.dispatchSpy();
        const a = mockUser({username: "a"});
        const b = mockUser({username: "b"});

        // Subject
        const rendered = shallow(<AddMember members={[]} users={[a, b]} groupId={groupId}/>);
        rendered.find("button.btn-success").simulate("click", mockEvent());

        // Expectations
        // * First test that the fetch is called
        expect(fetch.called).to.be.true;
        const invocation = fetch.args[0];
        const url = invocation[0];
        const options = invocation[1];
        expect(url).to.equal("/modelling-groups/group-1/actions/associate-member/");
        expect(options.body).to.eql(JSON.stringify({
            username: "a",
            action: "add"
        }));

        // * Then test that the response is handled correctly
        checkAsync(done, () => {
            expectOneAction(dispatchSpy, {action: "ModellingGroupActions.addMember", payload: "a" });
        });
    });
});