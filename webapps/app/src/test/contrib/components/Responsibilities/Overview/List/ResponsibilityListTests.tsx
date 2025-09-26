import * as React from "react";

import { shallow } from "enzyme";

import "../../../../../helper";
import { mockModellingGroup, mockResponsibility, mockScenario, mockTouchstoneVersion } from "../../../../../mocks/mockModels";
import { DiseaseFilter } from "../../../../../../main/contrib/components/Responsibilities/Overview/List/DiseaseFilter";
import { Responsibility } from "../../../../../../main/shared/models/Generated";
import { ExtendedResponsibilitySet } from "../../../../../../main/contrib/models/ResponsibilitySet";
import {
    ResponsibilityList,
    ResponsibilityListComponentProps
} from "../../../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityList";
import { ResponsibilityScenario } from "../../../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityScenario";

function makeProps(responsibilities: Array<Responsibility>,
                        currentDiseaseId?: string): ResponsibilityListComponentProps {
    const touchstone = mockTouchstoneVersion();
    const modellingGroup = mockModellingGroup();
    return {
        modellingGroup: modellingGroup,
        currentDiseaseId: currentDiseaseId,
        responsibilitySet: new ExtendedResponsibilitySet({
            modelling_group_id: modellingGroup.id,
            status: null,
            touchstone_version: touchstone.id,
            responsibilities,
            expectations: []
        }, touchstone, modellingGroup)
    };
}

describe('Responsibility Overview List Component tests', () => {

    it("renders message when there are no responsibilities", () => {
        const props = makeProps([]);
        const rendered = shallow(<ResponsibilityList {...props} />);
        expect(rendered.text()).toContain("This modelling group has no responsibilities in this touchstone");
    });

    it("renders one ResponsibilityComponent per responsibility", () => {
        const props = makeProps([
            mockResponsibility({}, mockScenario({ id: "scenario-1", disease: "d1", description: "A" })),
            mockResponsibility({}, mockScenario({ id: "scenario-2", disease: "d2", description: "B" }))
        ]);
        const rendered = shallow(<ResponsibilityList {...props} />);
        const children = rendered.find(ResponsibilityScenario);
        expect(children).toHaveLength(2);
        expect(children.at(0).key()).toEqual("scenario-1");
        expect(children.at(1).key()).toEqual("scenario-2");
    });


    it(
        "renders responsibilities ordered alphabetically by scenario description",
        () => {
            const props = makeProps([
                mockResponsibility({}, mockScenario({ description: "b", disease: "d1", id: "d" })),
                mockResponsibility({}, mockScenario({ description: "a", disease: "d2", id: "e" }))
            ]);
            const rendered = shallow(<ResponsibilityList {...props} />);
            const children = rendered.find(ResponsibilityScenario);
            expect(children).toHaveLength(2);
            expect(children.at(0).key()).toEqual("e");
            expect(children.at(1).key()).toEqual("d");
        }
    );

    it("renders disease filter", () => {
        const props = makeProps([ mockResponsibility() ]);
        const rendered = shallow(<ResponsibilityList {...props} />);
        expect(rendered.find(DiseaseFilter)).toHaveLength(1);
    });

    it("can filter be filtered by diesase", () => {
        const props = makeProps([
            mockResponsibility({}, mockScenario({ id: "scenario-1", disease: "d1" })),
            mockResponsibility({}, mockScenario({ id: "scenario-2", disease: "d2" }))
        ], "d2");
        const rendered = shallow(<ResponsibilityList {...props} />);
        const children = rendered.find(ResponsibilityScenario);
        expect(children).toHaveLength(1);
        expect(children.at(0).key()).toEqual("scenario-2");
    });
});