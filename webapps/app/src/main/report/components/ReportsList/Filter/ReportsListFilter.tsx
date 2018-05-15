import * as React from "react";
import {connect} from 'react-redux';
import {Action, Dispatch} from "redux";

import {reportActionCreators} from "../../../actions/reportActionCreators";

import {ReportsFilterFields, ReportsFilterPublishTypes,} from "../../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../../reducers/reportAppReducers";
import {ReportsListFilterPublished} from "./ReportsListFilterPublished";
import {DateRangePicker} from "../../../../shared/components/DatePicker/DateRangePicker";

interface ReportsListFilterProps {
    filterData: ReportsFilterFields;
    filterPublish: (value: ReportsFilterPublishTypes) => void;
    timeFromSelected: (date: Date) => void;
    timeUntilSelected: (date: Date) => void;
    isReviewer: boolean;
}

const fromMonth = new Date("2017-03-01T00:00:00");
const toMonth = new Date;

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="row">
        {props.isReviewer &&
        <ReportsListFilterPublished
            filterData={props.filterData}
            filterPublish={props.filterPublish}
        />
        }

        <DateRangePicker value={{end: fromMonth, start: toMonth}} startDate={fromMonth} endDate={toMonth}
                         timeFromSelected={props.timeFromSelected} timeUntilSelected={props.timeUntilSelected}/>
        <div className="clearfix"/>
    </div>
);

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListFilterProps> => {
    return {
        filterData: state.reports.reportsFilter,
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ReportsListFilterProps> => {
    return {
        filterPublish: (value: ReportsFilterPublishTypes) => {
            dispatch(reportActionCreators.filterReports({published: value}))
        },
        timeFromSelected: (time: Date) => {
            dispatch(reportActionCreators.filterReports({timeFrom: time.toString()}))
        },
        timeUntilSelected: (time: Date) => {
            dispatch(reportActionCreators.filterReports({timeUntil: time.toString()}))
        }
    }
};

export const ReportsListFilter = connect(mapStateToProps, mapDispatchToProps)(ReportsListFilterComponent);

