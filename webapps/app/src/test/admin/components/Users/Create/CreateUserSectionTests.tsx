import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import {
    CreateUserSectionComponent
} from "../../../../../main/admin/components/Users/Create/CreateUserSection";
import { Sandbox } from "../../../../Sandbox";
import { expectOneAction } from "../../../../actionHelpers";
import { CreateUserForm } from "../../../../../main/admin/components/Users/Create/CreateUserForm";

describe("CreateUserSectionComponenent", () => {
    const sandbox  = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders form when 'show' is true", () => {
        const rendered = shallow(<CreateUserSectionComponent show={true}/>);
        expect(rendered.find(CreateUserForm)).to.have.length(1);
        expect(rendered.find("button")).to.have.length(0);
    });

    it("renders button when 'show' is false", () => {
        const rendered = shallow(<CreateUserSectionComponent show={false}/>);
        expect(rendered.find(CreateUserForm)).to.have.length(0);
        expect(rendered.find("button")).to.have.length(1);
    });

    it("button triggers setShowCreateUser", () => {
        const spy = sandbox.dispatchSpy();
        const rendered = shallow(<CreateUserSectionComponent show={false}/>);
        rendered.find("button").simulate("click");
        expectOneAction(spy, {
            action: "UserActions.setShowCreateUser",
            payload: true
        });
    });
});