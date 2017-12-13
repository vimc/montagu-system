import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";

import { Option, OptionSelector } from "../../../main/contrib/components/OptionSelector/OptionSelector";

function mockOptions(): Option[] {
    return [
        { value: "apple", text: "Apple" },
        { value: "pear", text: "Pear" },
    ];
}

describe('OptionSelector', () => {
    it("renders option", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption=""
                                                 onChange={ callback }  required={false} name={"fruit"}/>);
        const children = rendered.find("option");
        expect(children).to.have.length(2);
        expect(children.at(0).prop("value")).to.equal("apple");
        expect(children.at(0).text()).to.equal("Apple");
    });

    it("renders default option", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={false} name={"fruit"}/>);
        const children = rendered.find("option");
        expect(children).to.have.length(3);
        expect(children.at(0).prop("value")).to.equal("");
        expect(children.at(0).text()).to.equal("Fruit");
    });

    it("adds required attribute", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={true} name={"fruit"}/>);

        expect(rendered.find("select").prop("required")).to.be.true;
    });

    it("does not add required attribute", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={false} name={"fruit"}/>);

        expect(rendered.find("select").prop("required")).not.to.be.true;
    });

    it("adds name attribute", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={false} name={"fruit"}/>);

        expect(rendered.find("select").prop("name")).to.equal("fruit");
    });

    it("invokes the callback when an option is selected", () => {
        const callback = sinon.spy();
        const rendered = shallow(<OptionSelector options={ [] } defaultOption="" onChange={ callback }
                                                 required={false} name={"fruit"}/>);
        rendered.find("select").simulate("change", {
            currentTarget: {
                value: "test",
            },
            preventDefault: () => {
            }
        });
        expect(callback.called).to.be.equal(true, "Expected callback to be called");
        expect(callback.args[ 0 ][ 0 ]).to.equal("test");
    });
});