import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { mockTouchstone } from '../mocks';

import { TouchstoneListComponent } from '../../main/components/Touchstones/TouchstoneList';
import { State } from '../../main/stores/TouchstoneStore';
import { Touchstone } from '../../main/Models';
import { Link } from "simple-react-router";

function makeStoreState(touchstones: Array<Touchstone>): State {
    return {
        ready: true,
        errorMessage: "",
        touchstones
    };
}

describe('TouchstoneListComponent', () => {
    it("renders message when there are no touchstones", () => {
        const state = makeStoreState([]);
        const rendered = shallow(<TouchstoneListComponent {...state} />);
        expect(rendered.text()).to.contain("There are no touchstones currently.");
    });

    it("renders one Link per touchstone", () => {
        const state = makeStoreState([
            mockTouchstone({ id: "touchstone-1", description: "Description 1" }),
            mockTouchstone({ id: "touchstone-2", description: "Description 2" })
        ]);
        const rendered = mount(<TouchstoneListComponent {...state} />);
        const children = rendered.find("li");
        expect(children).to.have.length(2);

        // Check the first link in detail
        const first = children.at(0);
        expect(first.key()).to.equal("touchstone-1");
        const link = first.find(Link);
        expect(link.prop('href')).to.equal("/responsibilities/touchstone-1/");
        expect(link.text()).to.equal("Description 1");

        // Also do a basic test on the other one, to make sure it's different
        expect(children.at(1).key()).to.equal("touchstone-2");
    });
});