import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";

import "../../../helper";
import {
    mapStateToProps,
    ReportsListFilterComponent
} from "../../../../main/report/components/ReportsList/Filter/ReportsListFilter";
import {Sandbox} from "../../../Sandbox";
import {ReportsFilterPublishTypes} from "../../../../main/report/actionTypes/ReportsActionsTypes";
import {DatePicker} from "../../../../main/shared/components/DatePicker/DatePicker";
import {ReportsListFilterPublished} from "../../../../main/report/components/ReportsList/Filter/ReportsListFilterPublished";
import {ReportsListFilterDate} from "../../../../main/report/components/ReportsList/Filter/ReportsListFilterDate";
import {mockAuthState, mockReportAppState} from "../../../mocks/mockStates";

describe("ReportListFilter", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("can render filter published with given value", () => {
        const rendered = shallow(<ReportsListFilterPublished
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: null,
                timeUntil: null
            }}
            filterPublish={() => {
            }}
        />);
        const select = rendered.find('select');
        expect(select.props().value).to.equal("published");
        expect(select.props().children).to.have.length(3);
    });

    it("can render filter time from with given value and until with no value", () => {
        const rendered = shallow(<ReportsListFilterDate
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: "2017-02-01T00:00:00",
                timeUntil: null
            }}
            timeFromSelected={() => {
            }}
            timeUntilSelected={() => {
            }}
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
        const rendered = shallow(<ReportsListFilterDate
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: null,
                timeUntil: "2018-09-07T00:00:00"
            }}
            timeFromSelected={() => {
            }}
            timeUntilSelected={() => {
            }}
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
        const rendered = shallow(<ReportsListFilterPublished
            filterData={{
                published: ReportsFilterPublishTypes.published,
                timeFrom: null,
                timeUntil: null
            }}
            filterPublish={filterPublishSpy}
        />);
        const select = rendered.find('select');
        select.simulate('change', {target: {value: 'not_published'}});
        expect(filterPublishSpy.called).is.equal(true);
        expect(filterPublishSpy.getCall(0).args).is.eql(["not_published"]);
    });

    it("does not render publish filter if user is not reviewer", () => {
        const rendered = shallow(<ReportsListFilterComponent
            isReviewer={false} filterData={null} filterPublish={null}
            timeFromSelected={null} timeUntilSelected={null}
        />);
        const publishFilter = rendered.find(ReportsListFilterPublished);
        expect(publishFilter).to.have.lengthOf(0);
    });

    it("renders publish filter if user is not reviewer", () => {
        const rendered = shallow(<ReportsListFilterComponent
            isReviewer={true} filterData={null} filterPublish={null}
            timeFromSelected={null} timeUntilSelected={null}
        />);
        const publishFilter = rendered.find(ReportsListFilterPublished);
        expect(publishFilter).to.have.lengthOf(1);
    });

    it("is not reviewer if auth state does not have review reports permission", () => {
        const props = mapStateToProps(mockReportAppState());
        expect(props.isReviewer).to.be.false;
    });

    it("is reviewer if auth state does have review reports permission", () => {
        const props = mapStateToProps(
            mockReportAppState({
                auth: mockAuthState({
                    permissions: ["*/reports.review"]
                })
            }));
        expect(props.isReviewer).to.be.true;
    });

});