import {shallow} from "enzyme";
import * as React from "react";


import "../../../../../helper";
import {
    ModellingGroupMembersAdd, ModellingGroupMembersAddComponent,
    ModellingGroupMembersAddState
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersAdd";
import {mockUser} from "../../../../../mocks/mockModels";
import {mockEvent} from "../../../../../mocks/mocks";
import {Sandbox} from "../../../../../Sandbox";
import {createMockStore} from "../../../../../mocks/mockStore";
import {modellingGroupsActionCreators} from "../../../../../../main/admin/actions/modellingGroupsActionCreators";

describe("Modelling Group Members Add component tests", () => {

    describe("connected component", () => {
        const groupId = "group-1";
        const testUser1 = mockUser({username: "a"});
        const testUser2 = mockUser({username: "b"});

        const testState = {users: {users: [testUser1, testUser2]}};

        const sandbox = new Sandbox();

        afterEach(() => sandbox.restore());

        it("render on connect level", () => {
            const store = createMockStore(testState);
            const rendered = shallow(
                <ModellingGroupMembersAdd
                    members={[testUser1.username]}
                    groupId={groupId}
                />,
                {context: {store}}
            );
            expect(rendered.find(ModellingGroupMembersAddComponent).length).toEqual(1);
            expect(rendered.props().members).toEqual([testUser1.username]);
            expect(rendered.props().users).toEqual([testUser1, testUser2]);
            expect(rendered.props().groupId).toEqual(groupId);
            expect(typeof rendered.props().addUserToGroup).toEqual("function");
        });

        it("when user clicks Add, emits correct actions", () => {
            const store = createMockStore(testState);
            const addUserToGroupStub = sandbox.setStubReduxAction(modellingGroupsActionCreators, "addUserToGroup");
            const rendered = shallow(
                <ModellingGroupMembersAdd members={[]} users={[testUser1, testUser2]} groupId={groupId}/>,
                {context: {store}}
            ).dive();
            rendered.find("button.btn-success").simulate("click", mockEvent());
            expect(addUserToGroupStub.mock.calls.length).toBe(1);
            expect(addUserToGroupStub.mock.calls[0][0]).toEqual("group-1");
            expect(addUserToGroupStub.mock.calls[0][1]).toEqual("a");
        });
    });

    describe("component", () => {
        const groupId = "group-1";

        const sandbox = new Sandbox();

        afterEach(() => sandbox.restore());

        it(
            "empty add member has no selected user and renders helpful message",
            () => {

                const addSpy = sandbox.createSpy();
                const rendered = shallow(<ModellingGroupMembersAddComponent members={[]} users={[]} groupId={groupId} addUserToGroup={addSpy}/>);

                const expectedState: ModellingGroupMembersAddState = {
                    selectedUser: "",
                    options: []
                };
                expect(rendered.instance().state).toEqual(expectedState);
                expect(rendered.text()).toContain("No more users available to add");
                expect(rendered.find("form")).toHaveLength(0);
            }
        );

        it("renders options alphabetically", () => {
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "apple"});
            const b = mockUser({username: "banana"});
            const c = mockUser({username: "clementine"});
            const rendered = shallow(<ModellingGroupMembersAddComponent members={[]} users={[c, a, b]} groupId={groupId} addUserToGroup={addSpy}/>);
            const expectedState: ModellingGroupMembersAddState = {
                selectedUser: "apple",
                options: [a, b, c]
            };
            expect(rendered.instance().state).toEqual(expectedState);
            expect(rendered.text()).not.toContain("No more users available to add");
            expect(rendered.find("form")).toHaveLength(1);
            expect(rendered.find("option").getElements().map(e => e.props.value)).toEqual([
                "apple",
                "banana",
                "clementine"
            ]);
        });

        it("does not show options that are already members", () => {
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "a"});
            const b = mockUser({username: "b"});
            const c = mockUser({username: "c"});
            const rendered = shallow(<ModellingGroupMembersAddComponent members={["a", "c"]} users={[a, b, c]} groupId={groupId} addUserToGroup={addSpy}/>);
            const expectedState: ModellingGroupMembersAddState = {
                selectedUser: "b",
                options: [b]
            };
            expect(rendered.instance().state).toEqual(expectedState);
            expect(rendered.find("option")).toHaveLength(1);
        });

        it("when user selects option, selectedUser changes state", () => {
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "a"});
            const b = mockUser({username: "b"});
            const rendered = shallow(<ModellingGroupMembersAddComponent members={[]} users={[a, b]} groupId={groupId} addUserToGroup={addSpy}/>);
            expect(rendered.instance().state.selectedUser).toEqual("a");
            rendered.find("select").simulate("change", { target: { value: "b" } });
            expect(rendered.instance().state.selectedUser).toEqual("b");
        });

        it("when user clicks Add, emits correct actions", () => {
            // Mocks
            const addSpy = sandbox.createSpy();
            const a = mockUser({username: "a"});
            const b = mockUser({username: "b"});

            // Subject
            const rendered = shallow(<ModellingGroupMembersAddComponent members={[]} users={[a, b]} groupId={groupId} addUserToGroup={addSpy}/>);
            rendered.find("button.btn-success").simulate("click", mockEvent());
            expect(addSpy.mock.calls.length).toBe(1);
            expect(addSpy.mock.calls[0][0]).toEqual("group-1");
            expect(addSpy.mock.calls[0][1]).toEqual("a");
        });
    });
});