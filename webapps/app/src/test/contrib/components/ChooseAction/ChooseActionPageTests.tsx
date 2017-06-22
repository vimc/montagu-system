import * as React from "react";
import { Sandbox } from "../../../Sandbox";
import { ChooseActionPage, LocationProps } from "../../../../main/contrib/components/ChooseAction/ChooseActionPage";
import { mockLocation } from "../../../mocks/mocks";
import { expectOneAction } from "../../../actionHelpers";

describe("ChooseActionPage", () => {
    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    it("triggers setModellingGroup on load", () => {
        const spy = sandbox.dispatchSpy();
        const location = mockLocation<LocationProps>({ groupId: "gId" });
        sandbox.mount(<ChooseActionPage location={ location } />);
        expectOneAction(spy, {
            action: "ModellingGroupActions.setCurrentModellingGroup",
            payload: "gId"
        });
    });
});