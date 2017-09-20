import * as React from "react";
import { expect } from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../../mocks/mockModels";
import { setupMainStore } from "../../../mocks/mocks";
import { Sandbox } from "../../../Sandbox";

import { ButtonLink } from "../../../../main/shared/components/ButtonLink";
import { ResponsibilityComponent } from "../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityComponent";
import { BurdenEstimateSet, ResponsibilitySetStatus } from "../../../../main/shared/models/Generated";

const styles = require("../../../../main/contrib/components/Responsibilities/Responsibilities.css");
const messageStyles = require("../../../../main/shared/styles/messages.css");

describe('ResponsibilityComponent', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();

    function setUpComponent(responsibilitySetStatus: ResponsibilitySetStatus, burdenEstimateSet?: BurdenEstimateSet){
        setupMainStore({
            diseases: [
                { id: "disease-id", name: "Disease name" }
            ]
        });

        const responsibility = mockResponsibility({
            status: "empty",
            current_estimate_set: burdenEstimateSet
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

    it("displays no estimates message if current estimate is null", () => {
        setUpComponent("incomplete");
        expect(rendered.find(`.${messageStyles.info}`).text()).to.eq("You have not uploaded any burden estimate sets.")
    });

    it("displays last uploaded estimate date if current estimate is populated", () => {
        setUpComponent("incomplete", { id: 1, problems: [], uploaded_on : "2017-07-13 13:55:29 +0100"});
        expect(rendered.find(`.${messageStyles.info}`).text()).to.eq("You last uploaded an estimate on 2017-07-13 13:55:29 +0100.")
    });

    it("renders the coverage download link", () => {
        setUpComponent("incomplete");
        const link = rendered.findWhere(e => e.is(ButtonLink) && e.children().text() == "Download coverage data");
        expect(link.prop("href")).to.equal(`/group-1/responsibilities/touchstone-1/coverage/scenario-1/`);
    });
});