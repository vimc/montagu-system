import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";

import {
    mockBurdenEstimateSet,
    mockModellingGroup,
    mockResponsibility,
    mockScenario,
    mockTouchstone
} from "../../../mocks/mockModels";
import {setupMainStore} from "../../../mocks/mocks";
import {Sandbox} from "../../../Sandbox";

import {ButtonLink} from "../../../../main/shared/components/ButtonLink";
import {ResponsibilityComponent} from "../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityComponent";
import {BurdenEstimateSet, ResponsibilitySetStatus} from "../../../../main/shared/models/Generated";
import {CurrentEstimateSetSummary} from "../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";

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
        expect(rendered.find(".header").text()).to.equal("Description  (ID: scenario-1)empty");
    });

    it("renders the responsibility status", () => {
        setUpComponent("incomplete");
        expect(rendered.find(".header").text()).to.contain("empty");
    });

    it("renders current estimate set section", () => {
        const set = mockBurdenEstimateSet();
        setUpComponent("incomplete", set);
        const summary = rendered.find(CurrentEstimateSetSummary);
        expect(summary).to.have.length(1);
        expect(summary.props()).to.eql({
            estimateSet: set,
            canUpload: true
        });
    });

    it("renders the coverage download link", () => {
        setUpComponent("incomplete");
        const link = rendered.findWhere(e => e.is(ButtonLink) && e.children().text() == "Download coverage data");
        expect(link.prop("href")).to.equal(`/group-1/responsibilities/touchstone-1/coverage/scenario-1/`);
    });
});