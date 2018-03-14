import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {ReportReader, ReportReadersList} from "../../../../main/report/components/Sidebar/ReportReadersList";
import {mockRole, mockUser} from "../../../mocks/mockModels";
import {User} from "../../../../main/shared/models/Generated";
import {Link} from "react-router-dom";
import {Sandbox} from "../../../Sandbox";

describe("Report readers list", () => {

    const sandbox = new Sandbox();

    beforeEach(() => {
        sandbox.restore();
    });

    it("sorts users alphabetically", () => {

        const users: User[] = [mockUser({username: "b"}), mockUser({username: "a"}), mockUser({username: "c"})];

        const rendered = shallow(<ReportReadersList users={users} report={"report"}
                                                    removeReportReader={null} addReportReader={null}/>);
        const renderedUsers = rendered.find(ReportReader);
        expect(renderedUsers).to.have.lengthOf(3);
        expect(renderedUsers.at(0).prop("user").username).to.eq("a");
        expect(renderedUsers.at(1).prop("user").username).to.eq("b");
        expect(renderedUsers.at(2).prop("user").username).to.eq("c");

    });

    it("adds a new report reader", () => {

        const users: User[] = [mockUser({username: "b"}), mockUser({username: "a"}), mockUser({username: "c"})];
        const stub = sandbox.sinon.stub();
        const rendered = shallow(<ReportReadersList users={users} report={"report"}
                                                    removeReportReader={null} addReportReader={stub}/>);

        rendered.setState({newReader: "test.user"});
        const addUserButton = rendered.find("button");
        addUserButton.simulate("click");
        expect(stub.calledWith("test.user"));
    })
});

describe("Report reader", () => {

    it("shows delete link if user is not a global reader", () => {

        const user: User = mockUser({
            roles: [mockRole({
                name: "reports-reader",
                scope_id: "somereport", scope_prefix: "report"
            })]
        });

        const rendered = shallow(<ReportReader user={user} removeReportReader={() => {
        }}/>);
        const deleteLink = rendered.find(Link);
        expect(deleteLink).to.have.lengthOf(1);
    });

    it("does not show delete link if user is a global reader", () => {

        const user: User = mockUser({roles: [mockRole({name: "reports-reader"})]});

        const rendered = shallow(<ReportReader user={user} removeReportReader={() => {
        }}/>);
        const deleteLink = rendered.find(Link);
        expect(deleteLink).to.have.lengthOf(0);
    });

    it("renders full name", () => {

        const user: User = mockUser({
            name: "full name", username: "user.name",
            roles: [mockRole({name: "reports-reader"})]
        });

        const rendered = shallow(<ReportReader user={user} removeReportReader={() => {
        }}/>);
        const name = rendered.find("span");
        expect(name.text()).to.eq("full name");
    });

    it("renders username", () => {

        const user: User = mockUser({
            name: "full name", username: "user.name",
            roles: [mockRole({name: "reports-reader"})]
        });

        const rendered = shallow(<ReportReader user={user} removeReportReader={() => {
        }}/>);
        const username = rendered.find(".text-muted");
        expect(username.text()).to.eq("user.name");
    })

});