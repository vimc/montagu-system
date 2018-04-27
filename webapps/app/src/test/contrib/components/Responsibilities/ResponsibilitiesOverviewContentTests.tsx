import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {expect} from "chai"

import "../../../helper";
import {
    ResponsibilityOverviewContentProps,
    ResponsibilityOverviewContentComponent
} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {RecursivePartial} from "../../../mocks/mockStates";
import {ResponsibilityOverviewDescription} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewDescription";

function makeProps(touchstoneId: string): ResponsibilityOverviewContentProps {
    const touchstone = mockTouchstone({id: touchstoneId});
    const modellingGroup = mockModellingGroup();
    return {
        modellingGroup: modellingGroup,
        currentDiseaseId: "d1",
        responsibilitySet: new ExtendedResponsibilitySet({
            problems: "",
            status: null,
            touchstone: touchstone.id,
            responsibilities: []
        }, touchstone, modellingGroup),
        touchstoneId: touchstone.id
    };
}

let fakeState: RecursivePartial<ContribAppState> = {
    user: {
        signedConfidentialityAgreement: false
    }
};

describe('ResponsibilityOverviewContent', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
        fakeState = {
            user: {
                signedConfidentialityAgreement: false
            }
        };
    });

    it("show params if touchstone is not rfp", () => {

        const rendered = shallow(<ResponsibilityOverviewContentComponent {...makeProps("something")} />);
        const params = rendered.find("#params-section");
        expect(params).to.have.lengthOf(1)
    });

    it("does not show params if touchstone is rfp", () => {

        const rendered = shallow(<ResponsibilityOverviewContentComponent {...makeProps("rfp-1")} />);
        const params = rendered.find("#params-section");
        expect(params).to.have.lengthOf(0)
    });

    it("renders description", () => {

        const rendered = shallow(<ResponsibilityOverviewContentComponent {...makeProps("something")} />);
        const description = rendered.find(ResponsibilityOverviewDescription);
        expect(description).to.have.lengthOf(1)
    });

});