import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import "../../../../../helper";
import { mockUser } from "../../../../../mocks/mockModels";
import { Sandbox } from "../../../../../Sandbox";
import { InternalLink } from "../../../../../../main/shared/components/InternalLink";
import {
    ModellingGroupMembersDeletableUser,
    ModellingGroupMembersDeletableUserComponent
} from "../../../../../../main/admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersDeletableUser";
import {createMockStore} from "../../../../../mocks/mockStore";
import {modellingGroupsActionCreators} from "../../../../../../main/admin/actions/modellingGroupsActionCreators";

describe("Modelling Group Members Deletable User Component tests", () => {

    describe("Connected", () => {

        const sandbox = new Sandbox();
        afterEach(() => sandbox.restore());

        it("passes right props on connect level", () => {
            const store = createMockStore();
            const testUser = mockUser();
            const rendered = shallow(<ModellingGroupMembersDeletableUser
                user={testUser}
                groupId={"g-1"}
                showDelete={true}
            />, {context: {store}});
            expect(rendered.props().user).to.eql(testUser);
            expect(rendered.props().groupId).to.eql("g-1");
            expect(rendered.props().showDelete).to.be.true;
            expect(typeof rendered.props().removeUserFromGroup).to.eql("function");
        });

        it("triggers action on remove click", () => {
            const store = createMockStore();
            const testUser = mockUser();
            const rendered = shallow(<ModellingGroupMembersDeletableUser
                user={testUser}
                groupId={"g-1"}
                showDelete={true}
            />, {context: {store}}).dive();
            const deleteLink = rendered.find("InternalLink.text-danger").dive();
            const removeActionStub = sandbox.setStubReduxAction(modellingGroupsActionCreators, "removeUserFromGroup");
            deleteLink.simulate("click");
            expect(removeActionStub.called).to.be.true;
            expect(removeActionStub.getCall(0).args[0]).to.equal("g-1");
            expect(removeActionStub.getCall(0).args[1]).to.equal(testUser.username);
        });
    });

    describe("Component", () => {

        const testUser = mockUser({"username": "w.a.m", "name": "Wolfgang Amadeus Mozart"});

        const sandbox = new Sandbox();
        let removeSpy: sinon.SinonSpy;
        beforeEach(() => {
            removeSpy = sandbox.createSpy();
        });
        afterEach(() => sandbox.restore());

        it("renders link to user page", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={true}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            expect(rendered.find(InternalLink).at(0).prop("href")).to.eq("/users/w.a.m/")
        });

        it("renders delete link", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={true}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            const deleteInternalLink = rendered.find("InternalLink.text-danger");
            expect(deleteInternalLink.dive().text()).to.eq("Remove member")
        });

        it("does not render delete link if showDelete is false", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={false}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            const deleteInternalLink = rendered.find("InternalLink.text-danger");
            expect(deleteInternalLink.length).to.equal(0);
        });

        it("triggers remove function", () => {
            const rendered = shallow(<ModellingGroupMembersDeletableUserComponent
                showDelete={true}
                groupId="group1"
                user={testUser}
                removeUserFromGroup={removeSpy}
            />);
            const deleteLink = rendered.find("InternalLink.text-danger").dive();
            deleteLink.simulate("click");
            expect(removeSpy.called).to.be.true;
            expect(removeSpy.getCall(0).args[0]).to.equal("group1");
            expect(removeSpy.getCall(0).args[1]).to.equal(testUser.username);
        });

    });

});
