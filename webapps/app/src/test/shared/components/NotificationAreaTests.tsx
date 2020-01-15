import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {
    NotificationArea,
    NotificationAreaComponent
} from "../../../main/shared/components/NotificationArea/NotificationArea";
import * as CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

describe("NotificationArea", () => {
    function clear() {
    }

    test("only renders first message", () => {
        const rendered = shallow(<NotificationAreaComponent infoMessages={["XXXX", "YYYY"]} clear={clear}/>);
        const text = rendered.find(CSSTransitionGroup).render().text();
        expect(text).to.contain("XXXX");
        expect(text).to.not.contain("YYYY");
    });
});