import * as React from "react";

import { shallow } from "enzyme";

import "../../helper";
import { Option, OptionSelector } from "../../../main/contrib/components/OptionSelector/OptionSelector";

function mockOptions(): Option[] {
    return [
        { value: "apple", text: "Apple" },
        { value: "pear", text: "Pear" },
    ];
}

describe('OptionSelector', () => {
    it("renders option", () => {
        const callback = jest.fn();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption=""
                                                 onChange={ callback }  required={false} name={"fruit"}/>);
        const children = rendered.find("option");
        expect(children).toHaveLength(2);
        expect(children.at(0).prop("value")).toEqual("apple");
        expect(children.at(0).text()).toEqual("Apple");
    });

    it("renders default option", () => {
        const callback = jest.fn();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={false} name={"fruit"}/>);
        const children = rendered.find("option");
        expect(children).toHaveLength(3);
        expect(children.at(0).prop("value")).toEqual("");
        expect(children.at(0).text()).toEqual("Fruit");
    });

    it("adds required attribute", () => {
        const callback = jest.fn();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={true} name={"fruit"}/>);

        expect(rendered.find("select").prop("required")).toBe(true);
    });

    it("does not add required attribute", () => {
        const callback = jest.fn();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={false} name={"fruit"}/>);

        expect(rendered.find("select").prop("required")).not.toBe(true);
    });

    it("adds name attribute", () => {
        const callback = jest.fn();
        const rendered = shallow(<OptionSelector options={ mockOptions() } defaultOption="Fruit"
                                                 onChange={ callback } required={false} name={"fruit"}/>);

        expect(rendered.find("select").prop("name")).toEqual("fruit");
    });

    it("invokes the callback when an option is selected", () => {
        const callback = jest.fn();
        const rendered = shallow(<OptionSelector options={ [] } defaultOption="" onChange={ callback }
                                                 required={false} name={"fruit"}/>);
        rendered.find("select").simulate("change", {
            currentTarget: {
                value: "test",
            },
            preventDefault: () => {
            }
        });
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0][0]).toEqual("test");
    });
});