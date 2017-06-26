import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { NotificationArea } from "../../../main/shared/components/NotificationArea/NotificationArea";
import * as CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

describe("NotificationArea", () => {
    it("only renders first message", () => {
        const rendered = shallow(<NotificationArea notifications={ ["XXXX", "YYYY"] } />);
        const text = rendered.find(CSSTransitionGroup).render().text();
        expect(text).to.contain("XXXX");
        expect(text).to.not.contain("YYYY");
    });
});