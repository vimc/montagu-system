import * as React from "react";

import {shallow} from "enzyme";

import "../../helper";
import {Sandbox} from "../../Sandbox";
import {DatePicker} from "../../../main/shared/components/DatePicker/DatePicker";
import {DateRangePicker} from "../../../main/shared/components/DatePicker/DateRangePicker";

describe("DateRangePicker", () => {

    const sandbox = new Sandbox();

    beforeEach(() => {
        sandbox.restore();
    });

    const value = {
        start: new Date(2016, 12, 20),
        end: new Date(2018, 1, 12)
    };

    const from = new Date(2016, 4, 15);
    const to = new Date(2018, 4, 15);

    it("renders start date picker", () => {

        const rendered = shallow(<DateRangePicker
            startDate={from}
            endDate={to}
            timeFromSelected={sandbox.createSpy}
            timeUntilSelected={sandbox.createSpy}
            value={value}/>);

        const startDatePicker = rendered.find(DatePicker).first();

        expect(startDatePicker.first().prop("value")).toEqual(value.start);
        expect(startDatePicker.first().prop("fromMonth")).toEqual(from);
        expect(startDatePicker.first().prop("toMonth")).toEqual(to);

    });

    it("renders end date picker", () => {

        const rendered = shallow(<DateRangePicker
            startDate={from}
            endDate={to}
            timeFromSelected={sandbox.createSpy}
            timeUntilSelected={sandbox.createSpy}
            value={value}/>);

        const startDatePicker = rendered.find(DatePicker).last();

        expect(startDatePicker.first().prop("value")).toEqual(value.end);
        expect(startDatePicker.first().prop("fromMonth")).toEqual(from);
        expect(startDatePicker.first().prop("toMonth")).toEqual(to);

    });

    it("calls timeFromSelected when start date changes", () => {

        const timeFromSelectedStub = sandbox.createSpy();

        const rendered = shallow(<DateRangePicker
            startDate={from}
            endDate={to}
            timeFromSelected={timeFromSelectedStub}
            timeUntilSelected={sandbox.createSpy}
            value={value}/>);

        const startDatePicker = rendered.find(DatePicker).first();
        startDatePicker.simulate("change");

        expect(timeFromSelectedStub.mock.calls.length).toBe(1);
    });

    it("calls timeUntilSelected when end date changes", () => {

        const timeUntilSelectedStub = sandbox.createSpy();

        const rendered = shallow(<DateRangePicker
            startDate={from}
            endDate={to}
            timeFromSelected={sandbox.createSpy}
            timeUntilSelected={timeUntilSelectedStub}
            value={value}/>);

        const startDatePicker = rendered.find(DatePicker).last();
        startDatePicker.simulate("change");

        expect(timeUntilSelectedStub.mock.calls.length).toBe(1);
    });

});