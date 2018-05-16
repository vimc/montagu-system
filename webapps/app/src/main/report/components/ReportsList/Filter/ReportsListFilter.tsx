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

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => {

    const start = props.filterData.timeFrom ? new Date(props.filterData.timeFrom) : fromMonth;
    const end = props.filterData.timeUntil ? new Date(props.filterData.timeUntil) : toMonth;

    return <div className="row mb-2">
        {props.isReviewer &&
        <ReportsListFilterPublished
            filterData={props.filterData}
            filterPublish={props.filterPublish}
        />
        }
        <div className={"col-12"}>
            <DateRangePicker
                value={{end, start}}
                startDate={fromMonth} endDate={toMonth}
                timeFromSelected={props.timeFromSelected} timeUntilSelected={props.timeUntilSelected}/>
        </div>
        <div className="clearfix"/>
    </div>
}

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

