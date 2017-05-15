import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { mockResponsibility } from "../mocks/mockModels";

import { ResponsibilityListComponent } from "../../main/components/Responsibilities/ResponsibilityList";
import { ResponsibilityComponent } from "../../main/components/Responsibilities/ResponsibilityComponent";
import { DiseaseFilter } from "../../main/components/Responsibilities/DiseaseFilter";
import { Responsibility } from "../../main/Models";
import { State } from "../../main/stores/ResponsibilityStore";

const styles = require("../../main/components/Responsibilities/Responsibilities.css");

function makeStoreState(responsibilities: Array<Responsibility>,
                        currentDiseaseId?: string): State {
    return {
        currentTouchstone: null,
        currentModellingGroupId: null,
        currentDiseaseId: currentDiseaseId,
        responsibilitySet: {
            problems: "",
            status: null,
            touchstone: "touchstone-1",
            responsibilities
        },
        ready: true
    };
}

describe('ResponsibilityListComponent', () => {
    it("renders message when there are no responsibilities", () => {
        const state = makeStoreState([]);
        const rendered = shallow(<ResponsibilityListComponent {...state} />);
        expect(rendered.text()).to.contain("This modelling group has no responsibilities in this touchstone");
    });

    it("renders one ResponsibilityComponent per responsibility", () => {
        const state = makeStoreState([
            mockResponsibility({}, { id: "scenario-1", disease: "d1" }),
            mockResponsibility({}, { id: "scenario-2", disease: "d2" })
        ]);
        const rendered = shallow(<ResponsibilityListComponent {...state} />);
        const children = rendered.find(ResponsibilityComponent);
        expect(children).to.have.length(2);
        expect(children.at(0).key()).to.equal("scenario-1");
        expect(children.at(1).key()).to.equal("scenario-2");
    });

    it("renders disease filter", () => {
        const state = makeStoreState([ mockResponsibility() ]);
        const rendered = shallow(<ResponsibilityListComponent {...state} />);
        expect(rendered.find(DiseaseFilter)).to.have.length(1, "Expected to render DiseaseFilter");
    });

    it("can filter be filtered by diesase", () => {
        const state = makeStoreState([
            mockResponsibility({}, { id: "scenario-1", disease: "d1" }),
            mockResponsibility({}, { id: "scenario-2", disease: "d2" })
        ], "d2");
        const rendered = shallow(<ResponsibilityListComponent {...state} />);
        const children = rendered.find(ResponsibilityComponent);
        expect(children).to.have.length(1);
        expect(children.at(0).key()).to.equal("scenario-2");
    });
});