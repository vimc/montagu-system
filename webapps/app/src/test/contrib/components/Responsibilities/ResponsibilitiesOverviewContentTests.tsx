import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {expect} from "chai"
import {
    ResponsibilityOverviewComponentProps,
    ResponsibilityOverviewContentComponent
} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";

function makeProps(touchstoneId: string): ResponsibilityOverviewComponentProps {
    const touchstone = mockTouchstone({id: touchstoneId});
    const modellingGroup = mockModellingGroup();
    return {
        ready: true,
        modellingGroup: modellingGroup,
        currentDiseaseId: "d1",
        responsibilitySet: new ExtendedResponsibilitySet({
            problems: "",
            status: null,
            touchstone: touchstone.id,
            responsibilities: []
        }, touchstone, modellingGroup),
        currentTouchstoneId: touchstone.id
    };
}

describe('ResponsibilityOverviewPage', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("show params if touchstone is not 201801rfp-1", () => {

        const rendered = shallow(<ResponsibilityOverviewContentComponent {...makeProps("201701rfp-1")} />);
        const params = rendered.find("#params-section");
        expect(params).to.have.lengthOf(1)
    });

    it("does not show params if touchstone is 201801rfp-1", () => {

        const rendered = shallow(<ResponsibilityOverviewContentComponent {...makeProps("201801rfp-1")} />);
        const params = rendered.find("#params-section");
        expect(params).to.have.lengthOf(0)
    });
});