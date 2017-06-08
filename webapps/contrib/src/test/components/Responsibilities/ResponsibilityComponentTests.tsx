import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { mockModellingGroup, mockResponsibility, mockTouchstone } from "../../mocks/mockModels";
import { setupMainStore } from "../../mocks/mocks";
import { Sandbox } from "../../Sandbox";

import { ResponsibilityComponent } from "../../../main/components/Responsibilities/Overview/ResponsibilityComponent";
import { ButtonLink } from "../../../main/components/ButtonLink";

const styles = require("../../../main/components/Responsibilities/Responsibilities.css");

describe('ResponsibilityComponent', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    before(() => {
        setupMainStore([
            { id: "disease-id", name: "Disease name" }
        ]);

        const responsibility = mockResponsibility({
            status: "empty"
        }, {
            id: "scenario-1",
            description: "Description",
        });
        const touchstone = mockTouchstone({ id: "touchstone-1" });
        rendered = shallow(<ResponsibilityComponent
            modellingGroup={ mockModellingGroup() }
            responsibility={ responsibility }
            touchstone={ touchstone } />);
    });

    afterEach(() => sandbox.restore());

    it("renders the scenario header", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("Description (ID: scenario-1)");
    });

    it("renders the responsibility status", () => {
        expect(rendered.find(`.${styles.header}`).text()).to.contain("empty");
    });

    it("renders the coverage download link", () => {
        const link = rendered.findWhere(e => e.is(ButtonLink) && e.children().text() == "Download input data");
        expect(link.prop("href")).to.equal(`/responsibilities/touchstone-1/scenario-1/`);
    });
});