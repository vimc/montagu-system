import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import { mockResponsibility } from '../mocks';

import { ResponsibilityListComponent, ResponsibilityComponent } from '../../main/components/Responsibilities/ResponsibilityList';
import { Responsibility } from '../../main/Models';
import { State } from '../../main/stores/ResponsibilityStore';
const styles = require("../../main/components/Responsibilities/Responsibilities.css");

function makeStoreState(responsibilities: Array<Responsibility>): State {
    return {
        currentTouchstone: null,
        responsibilitySet: {
            problems: "",
            status: null,
            touchstone: "touchstone-1",
            responsibilities
        },
        ready: true,
        errorMessage: ""
    };
}

describe('ResponsibilityListComponent', () => {
    it("renders message when there are no responsibilities", () => {
        const state = makeStoreState([]);
        const rendered = shallow(<ResponsibilityListComponent {...state} />);
        expect(rendered.text()).to.contain("This modelling group has no responsibilities in the current touchstone");
    });

    it("renders one ResponsibilityComponent per responsibility", () => {
        const state = makeStoreState([
            mockResponsibility({}, { id: "scenario-1" }),
            mockResponsibility({}, { id: "scenario-2" })
        ]);
        const rendered = shallow(<ResponsibilityListComponent {...state} />);
        const children = rendered.find(ResponsibilityComponent);
        expect(children).to.have.length(2);
        expect(children.at(0).key()).to.equal("scenario-1");
        expect(children.at(1).key()).to.equal("scenario-2");
    });
});