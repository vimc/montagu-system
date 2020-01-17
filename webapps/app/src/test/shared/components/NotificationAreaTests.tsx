import * as React from "react";
import {shallow} from "enzyme";

import {
    NotificationArea,
    NotificationAreaComponent
} from "../../../main/shared/components/NotificationArea/NotificationArea";
import * as CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

describe("NotificationArea", () => {
    function clear() {
    }

    it("only renders first message", () => {
        const rendered = shallow(<NotificationAreaComponent infoMessages={["XXXX", "YYYY"]} clear={clear}/>);
        const text = rendered.find(CSSTransitionGroup).render().text();
        expect(text).toContain("XXXX");
        expect(text).not.toContain("YYYY");
    });
});