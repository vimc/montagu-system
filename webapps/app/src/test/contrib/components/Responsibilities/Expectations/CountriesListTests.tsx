import * as React from "react";
import {CountriesList} from "../../../../../main/contrib/components/Responsibilities/Expectations/CountriesList";
import {mockCountry} from "../../../../mocks/mockModels";
import {Popover, PopoverBody} from "reactstrap";
import {shallow} from "enzyme";


describe("Countries list popover", () => {
    it("renders popover with link", () => {
        const countries = [mockCountry({name: "countrya"}), mockCountry({name: "countryb"})];

        const rendered = shallow(<CountriesList countries={countries} targetKey={"c1"}/>);
        expect(rendered.find("#c1").text()).toEqual("view list");
        expect(rendered.find(Popover).prop("target")).toEqual("c1");
    });

    it("renders country list in popover", () => {
        const countries = [mockCountry({name: "countrya"}), mockCountry({name: "countryb"})];

        const rendered = shallow(<CountriesList countries={countries} targetKey={"c1"}/>);
        expect(rendered.find(PopoverBody).childAt(0).text()).toEqual("countrya, countryb");
    });

    it("countries are alphabetical", () => {
        const countries = [mockCountry({name: "d"}), mockCountry({name: "b"}), mockCountry({name: "a"})];

        const rendered = shallow(<CountriesList countries={countries} targetKey={"c1"}/>);
        expect(rendered.find(PopoverBody).childAt(0).text()).toEqual("a, b, d");
    });
});