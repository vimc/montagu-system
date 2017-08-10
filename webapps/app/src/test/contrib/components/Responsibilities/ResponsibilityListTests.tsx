import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstone } from "../../../mocks/mockModels";

import { ResponsibilityListComponent, ResponsibilityListComponentProps } from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityList";
import { ResponsibilityComponent } from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityComponent";
import { DiseaseFilter } from "../../../../main/contrib/components/Responsibilities/Overview/List/DiseaseFilter";
import { Responsibility } from "../../../../main/shared/models/Generated";
import { ExtendedResponsibilitySet } from "../../../../main/contrib/models/ResponsibilitySet";

function makeProps(responsibilities: Array<Responsibility>,
                        currentDiseaseId?: string): ResponsibilityListComponentProps {
    const touchstone = mockTouchstone();
    const modellingGroup = mockModellingGroup();
    return {
        modellingGroup: modellingGroup,
        currentDiseaseId: currentDiseaseId,
        responsibilitySet: new ExtendedResponsibilitySet({
            problems: "",
            status: null,
            touchstone: touchstone.id,
            responsibilities
        }, touchstone, modellingGroup),
        ready: true
    };
}

describe('ResponsibilityListComponent', () => {
    it("renders message when there are no responsibilities", () => {
        const props = makeProps([]);
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        expect(rendered.text()).to.contain("This modelling group has no responsibilities in this touchstone");
    });

    it("renders one ResponsibilityComponent per responsibility", () => {
        const props = makeProps([
            mockResponsibility({}, mockScenario({ id: "scenario-1", disease: "d1" })),
            mockResponsibility({}, mockScenario({ id: "scenario-2", disease: "d2" }))
        ]);
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        const children = rendered.find(ResponsibilityComponent);
        expect(children).to.have.length(2);
        expect(children.at(0).key()).to.equal("scenario-1");
        expect(children.at(1).key()).to.equal("scenario-2");
    });

    it("renders disease filter", () => {
        const props = makeProps([ mockResponsibility() ]);
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        expect(rendered.find(DiseaseFilter)).to.have.length(1, "Expected to render DiseaseFilter");
    });

    it("can filter be filtered by diesase", () => {
        const props = makeProps([
            mockResponsibility({}, mockScenario({ id: "scenario-1", disease: "d1" })),
            mockResponsibility({}, mockScenario({ id: "scenario-2", disease: "d2" }))
        ], "d2");
        const rendered = shallow(<ResponsibilityListComponent {...props} />);
        const children = rendered.find(ResponsibilityComponent);
        expect(children).to.have.length(1);
        expect(children.at(0).key()).to.equal("scenario-2");
    });
});