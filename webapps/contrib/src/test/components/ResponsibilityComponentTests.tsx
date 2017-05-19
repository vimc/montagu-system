import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { mockResponsibility, mockTouchstone } from "../mocks/mockModels";
import { setupMainStore } from "../mocks/mocks";
import { alt } from "../../main/alt";

import { ResponsibilityComponent } from "../../main/components/Responsibilities/Overview/ResponsibilityComponent";

const styles = require("../../main/components/Responsibilities/Responsibilities.css");

describe('ResponsibilityComponent', () => {
    let rendered: ShallowWrapper<any, any>;

    before(() => {
        setupMainStore([
            { id: "disease-id", name: "Disease name" }
        ]);

        const responsibility = mockResponsibility({
            status: "empty"
        }, {
            id: "scenario-id",
            description: "Description",
        });
        rendered = shallow(<ResponsibilityComponent
            responsibility={ responsibility }
            touchstone={ mockTouchstone() } />);
    });

    after(() => {
        alt.recycle();
    });

    it("renders the scenario header", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("Description (ID: scenario-id)");
    });

    it("renders the responsibility status", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("empty");
    });
});