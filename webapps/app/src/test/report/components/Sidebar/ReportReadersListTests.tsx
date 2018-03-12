import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {ReportReader, ReportReadersList} from "../../../../main/report/components/Sidebar/ReportReadersList";
import {mockUser} from "../../../mocks/mockModels";
import {User} from "../../../../main/shared/models/Generated";

describe("Report readers list", () => {

    it("sorts users alphabetically", () => {

        const users: User[] = [mockUser({username: "b"}), mockUser({username: "a"}), mockUser({username: "c"})];
        
        const rendered = shallow(<ReportReadersList users={users} report={"report"} removeReportReader={() => {}}/>);
        const renderedUsers = rendered.find(ReportReader);
        expect(renderedUsers).to.have.lengthOf(3);
        expect(renderedUsers.at(0).prop("user").username).to.eq("a");
        expect(renderedUsers.at(1).prop("user").username).to.eq("b");
        expect(renderedUsers.at(2).prop("user").username).to.eq("c");

    })
});