import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";

import {ErrorLog, ErrorLogComponent} from "../../../main/shared/components/ErrorLog/ErrorLog";
import {Sandbox} from "../../Sandbox";
import {expectOneAction} from "../../actionHelpers";

describe("ErrorLog", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    function clear() {

    }

    it("is hidden when there are no errors", () => {
        const rendered = shallow(<ErrorLogComponent errors={[]} clear={clear} />);
        expect(rendered.text()).to.be.empty;
    });

    it("it renders each error", () => {
        const errors = ["a", "b"];
        const rendered = shallow(<ErrorLogComponent errors={errors} clear={clear}/>);
        const items = rendered.find("li");
        expect(items).to.have.length(2);
        expect(items.at(0).text()).to.equal("a");
        expect(items.at(1).text()).to.equal("b");
    });

    it("clicking clear button emits clear event", () => {
        const spy = sandbox.dispatchSpy();
        const errors = ["a", "b"];
        const rendered = shallow(<ErrorLogComponent errors={errors} clear={clear}/>);
        rendered.find("button").simulate("click");
        expectOneAction(spy, {action: "NotificationActions.clear", payload: "error"});
    });
});