import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import * as sinon from 'sinon';

import { OptionSelector, Option } from '../../main/components/OptionSelector/OptionSelector';

function mockOptions(): Option[] {
    return [
        { value: "apple", text: "Apple" },
        { value: "pear", text: "Pear" },
    ];
}

describe('OptionSelector', () => {
    it("renders option", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="" onChange={ callback } />);
        const children = rendered.find("option");
        expect(children).to.have.length(2);
        expect(children.at(0).prop("value")).to.equal("apple");
        expect(children.at(0).text()).to.equal("Apple");
    });

    it("renders default option", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit" onChange={ callback } />);
        const children = rendered.find("option");
        expect(children).to.have.length(3);
        expect(children.at(0).prop("value")).to.equal("");
        expect(children.at(0).text()).to.equal("Fruit");
    });

    it("invokes the callback when an option is selected", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ [] } defaultOption="" onChange={ callback } />);
        rendered.find("select").simulate("change", {
            currentTarget: {
                value: "test",
            },
            preventDefault: () => {}
        });
        expect(callback.called).to.be.equal(true, "Expected callback to be called");
        expect(callback.args[0][0]).to.equal("test");
    });
});