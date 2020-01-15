import * as React from "react";
import {CountriesList} from "../../../../../main/contrib/components/Responsibilities/Expectations/CountriesList";
import {mockCountry} from "../../../../mocks/mockModels";
import {Popover, PopoverBody} from "reactstrap";
import {shallow} from "enzyme";
import {expect} from "chai";

describe("Countries list popover", () => {
    test("renders popover with link", () => {
        const countries = [mockCountry({name: "countrya"}), mockCountry({name: "countryb"})];

        const rendered = shallow(<CountriesList countries={countries} targetKey={"c1"}/>);
        expect(rendered.find("#c1").text()).to.equal("view list");
        expect(rendered.find(Popover).prop("target")).to.equal("c1");
    });

    test("renders country list in popover", () => {
        const countries = [mockCountry({name: "countrya"}), mockCountry({name: "countryb"})];

        const rendered = shallow(<CountriesList countries={countries} targetKey={"c1"}/>);
        expect(rendered.find(PopoverBody).childAt(0).text()).to.equal("countrya, countryb");
    });

    test("countries are alphabetical", () => {
        const countries = [mockCountry({name: "d"}), mockCountry({name: "b"}), mockCountry({name: "a"})];

        const rendered = shallow(<CountriesList countries={countries} targetKey={"c1"}/>);
        expect(rendered.find(PopoverBody).childAt(0).text()).to.equal("a, b, d");
    });
});