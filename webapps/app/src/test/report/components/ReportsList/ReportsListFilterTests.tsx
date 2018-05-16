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
import {ReportsListFilterPublished} from "../../../../main/report/components/ReportsList/Filter/ReportsListFilterPublished";
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
            isReviewer={false} filterData={{}} filterPublish={null}
            timeFromSelected={null} timeUntilSelected={null}
        />);
        const publishFilter = rendered.find(ReportsListFilterPublished);
        expect(publishFilter).to.have.lengthOf(0);
    });

    it("renders publish filter if user is not reviewer", () => {
        const rendered = shallow(<ReportsListFilterComponent
            isReviewer={true} filterData={{}} filterPublish={null}
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