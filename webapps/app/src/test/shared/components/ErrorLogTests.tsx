import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import { ErrorLog } from "../../../main/shared/components/ErrorLog/ErrorLog";
import { Sandbox } from "../../Sandbox";
import { expectOneAction } from "../../actionHelpers";

describe("ErrorLog", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("is hidden when there are no errors", () => {
        const rendered = shallow(<ErrorLog errors={ [] } />);
        expect(rendered.text()).to.be.empty;
    });

    it("it renders each error", () => {
        const errors = [ "a", "b" ];
        const rendered = shallow(<ErrorLog errors={ errors } />);
        const items = rendered.find("li");
        expect(items).to.have.length(2);
        expect(items.at(0).text()).to.equal("a");
        expect(items.at(1).text()).to.equal("b");
    });

    it("clicking clear button emits clear event", () => {
        const spy = sandbox.dispatchSpy();
        const errors = [ "a", "b" ];
        const rendered = shallow(<ErrorLog errors={ errors } />);
        rendered.find("button").simulate("click");
        expectOneAction(spy, { action: "NotificationActions.clear", payload: "error" });
    });
});