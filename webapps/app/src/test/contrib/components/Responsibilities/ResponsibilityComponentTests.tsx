import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../../mocks/mockModels";
import { setupMainStore } from "../../../mocks/mocks";
import { Sandbox } from "../../../Sandbox";

import { ButtonLink } from "../../../../main/shared/components/ButtonLink";
import { ResponsibilityComponent } from "../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityComponent";
import { ResponsibilitySetStatus } from "../../../../main/shared/models/Generated";

const styles = require("../../../../main/contrib/components/Responsibilities/Responsibilities.css");

describe('ResponsibilityComponent', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    function setUpComponent(responsibilitySetStatus: ResponsibilitySetStatus){
        setupMainStore({
            diseases: [
                { id: "disease-id", name: "Disease name" }
            ]
        });

        const responsibility = mockResponsibility({
            status: "empty"
        }, mockScenario({
            id: "scenario-1",
            description: "Description",
        }));
        const group = mockModellingGroup({ id: "group-1" });
        const touchstone = mockTouchstone({ id: "touchstone-1" });

        rendered = shallow(<ResponsibilityComponent
            modellingGroup={ group }
            responsibility={ responsibility }
            touchstone={ touchstone }
            responsibilitySetStatus={ responsibilitySetStatus }/>);
    }

    afterEach(() => sandbox.restore());

    it("renders the scenario header", () => {
        setUpComponent("incomplete");
        expect(rendered.find(`.${styles.header}`).text()).to.contain("Description (ID: scenario-1)");
    });

    it("renders the responsibility status", () => {
        setUpComponent("incomplete");
        expect(rendered.find(`.${styles.header}`).text()).to.contain("empty");
    });

    it("disables the upload button if status of set is locked", () => {
        setUpComponent("approved");
        expect(rendered.find(`.${styles.actions} button`).last().text()).to.eq("No more burden estimates can be uploaded");
        expect(rendered.find(`.${styles.actions} button`).last().prop("disabled")).to.eq(true);
    });

    it("allows uploads if status of set is incomplete", () => {
        setUpComponent("incomplete");
        expect(rendered.find(`.${styles.actions} button`).last().text()).to.eq("Upload a new burden estimate set");
        expect(rendered.find(`.${styles.actions} button`).last().prop("disabled")).to.eq(false);
    });

    it("renders the coverage download link", () => {
        setUpComponent("incomplete");
        const link = rendered.findWhere(e => e.is(ButtonLink) && e.children().text() == "Download coverage data");
        expect(link.prop("href")).to.equal(`/group-1/responsibilities/touchstone-1/coverage/scenario-1/`);
    });
});