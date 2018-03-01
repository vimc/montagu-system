import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

import "../../../helper";
import {ReportsListFilterComponent} from "../../../../main/report/components/ReportsList/ReportsListFilter";
import {Sandbox} from "../../../Sandbox";
import {ReportsFilterPublishTypes} from "../../../../main/report/actionTypes/ReportsActionsTypes";
import {DatePicker} from "../../../../main/shared/components/DatePicker/DatePicker";

describe("ReportListFilter", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("can render filter published with given value", () => {
        const rendered = shallow(<ReportsListFilterComponent
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: null,
                timeUntil: null
            }}
            filterPublish={()=>{}}
            timeFromSelected={()=>{}}
            timeUntilSelected={()=>{}}
        />);
        const radioButtons = rendered.find('input[type="radio"]');
        expect(radioButtons).to.have.length(3);
        expect(radioButtons.at(1).props().checked).to.equal(true);
        expect(radioButtons.at(0).props().checked).to.equal(false);
    });

    it("can render filter time from with given value and until with no value", () => {
        const rendered = shallow(<ReportsListFilterComponent
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: "2017-02-01T00:00:00",
                timeUntil: null
            }}
            filterPublish={()=>{}}
            timeFromSelected={()=>{}}
            timeUntilSelected={()=>{}}
        />);
        const datePickers = rendered.find(DatePicker);
        expect(datePickers).to.have.length(2);
        // converted from string to date when passing to datepicker
        const datePickerFromValueDate = datePickers.at(0).props().value;
        // equals given value
        expect(datePickerFromValueDate.getMonth()).to.equal(1);
        expect(datePickerFromValueDate.getFullYear()).to.equal(2017);
        expect(datePickerFromValueDate.getDate()).to.equal(1);
        const datePickerUntilValueDate = datePickers.at(1).props().value;
        // no value was given will use now
        expect(datePickerUntilValueDate.getMonth()).to.equal((new Date).getMonth());
        expect(datePickerUntilValueDate.getFullYear()).to.equal((new Date).getFullYear());
        expect(datePickerUntilValueDate.getDate()).to.equal((new Date).getDate());
    });

    it("can render filter time from with no value and until with value", () => {
        const rendered = shallow(<ReportsListFilterComponent
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: null,
                timeUntil: "2018-09-07T00:00:00"
            }}
            filterPublish={()=>{}}
            timeFromSelected={()=>{}}
            timeUntilSelected={()=>{}}
        />);
        const datePickers = rendered.find(DatePicker);
        expect(datePickers).to.have.length(2);
        const datePickerFromValueDate = datePickers.at(0).props().value;
        // default to 2017 march 01
        expect(datePickerFromValueDate.getMonth()).to.equal(2);
        expect(datePickerFromValueDate.getFullYear()).to.equal(2017);
        expect(datePickerFromValueDate.getDate()).to.equal(1);
        const datePickerUntilValueDate = datePickers.at(1).props().value;
        // equals given value
        expect(datePickerUntilValueDate.getMonth()).to.equal(8);
        expect(datePickerUntilValueDate.getFullYear()).to.equal(2018);
        expect(datePickerUntilValueDate.getDate()).to.equal(7);
    });

    it("trigger filterPublish", () => {
        const filterPublishSpy = sandbox.createSpy();
        const rendered = shallow(<ReportsListFilterComponent
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: null,
                timeUntil: null
            }}
            filterPublish={filterPublishSpy}
            timeFromSelected={()=>{}}
            timeUntilSelected={()=>{}}
        />);
        const radioButtons = rendered.find('input[type="radio"]');
        radioButtons.at(1).simulate('change', {target: { value : 'not_published'}});
        expect(filterPublishSpy.called).is.equal(true);
        expect(filterPublishSpy.getCall(0).args).is.eql(["not_published"]);
    });

});