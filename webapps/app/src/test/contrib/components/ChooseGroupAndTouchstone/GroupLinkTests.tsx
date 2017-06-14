import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import { mockModellingGroup } from "../../../mocks/mockModels";
import { Sandbox } from "../../../Sandbox";
import { expectOneAction } from "../../../actionHelpers";
import { alt } from "../../../../main/shared/alt";
import { modellingGroupActions } from "../../../../main/contrib/actions/ModellingGroupActions";

import { GroupLink } from "../../../../main/contrib/components/ChooseGroupAndTouchstone/GroupLink";

const styles = require("../../../../main/contrib/components/ChooseGroupAndTouchstone/Choose.css");

describe("GroupLink", () => {
    const sandbox = new Sandbox();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("when clicked triggers set current modelling group", () => {
        const group = mockModellingGroup();
        modellingGroupActions.update([ group ]);
        const rendered = shallow(<GroupLink group={ group } selected={ false } />);

        const spy = sandbox.dispatchSpy();
        rendered.find("div").simulate("click");
        expectOneAction(spy, { action: "ModellingGroupActions.setCurrentModellingGroup", payload: group.id });
    });

    it("when selected includes selected CSS class", () => {
        let rendered = shallow(<GroupLink group={ mockModellingGroup() } selected={ false } />);
        expect(rendered.find("div").hasClass(styles.selected)).to.be.false;

        rendered = shallow(<GroupLink group={ mockModellingGroup() } selected={ true } />);
        expect(rendered.find("div").hasClass(styles.selected)).to.be.true;
    })
});
