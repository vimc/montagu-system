import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch, Action } from "redux";

import {reportsActions} from "../../actions/reportsActions";
import {
    ReportsFilterFields, ReportsFilterPublishTypes,
} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";
import { DatePicker } from "../../../shared/components/DatePicker/DatePicker";
import {DataLinks} from "../Data/DataLinks";

interface ReportsListFilterProps {
    filterData: ReportsFilterFields;
    filterPublish: (value: ReportsFilterPublishTypes) => void;
    timeFromSelected: (date: Date) => void;
    timeUntilSelected: (date: Date) => void;
}

const fromMonth = new Date("2017-03-01T00:00:00");
const toMonth = new Date;

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="">
        <div className="form-group float-md-left">
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input
                        className="form-check-input form-control-sm"
                        type="radio"
                        value={ReportsFilterPublishTypes.all}
                        name="publish_filter"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.filterPublish(e.target.value as ReportsFilterPublishTypes)}
                        checked={props.filterData.published === ReportsFilterPublishTypes.all}
                    /> All
                </label>
            </div>
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input
                        className="form-check-input"
                        type="radio"
                        value={ReportsFilterPublishTypes.published}
                        name="publish_filter"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.filterPublish(e.target.value as ReportsFilterPublishTypes)}
                        checked={props.filterData.published === ReportsFilterPublishTypes.published}
                    /> Published
                </label>
            </div>
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input
                        className="form-check-input"
                        type="radio"
                        value={ReportsFilterPublishTypes.not_published}
                        name="publish_filter"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.filterPublish(e.target.value as ReportsFilterPublishTypes)}
                        checked={props.filterData.published === ReportsFilterPublishTypes.not_published}
                    /> Internal
                </label>
            </div>
        </div>
        <div className="float-md-right form-inline report-time-filters">
            <div className="">
                <label> From
                    <div className="ml-2">
                        <DatePicker
                            onChange={props.timeFromSelected}
                            value={props.filterData.timeFrom ? new Date(props.filterData.timeFrom) : fromMonth}
                            fromMonth={fromMonth}
                            toMonth={toMonth}
                        />
                    </div>
                </label>
            </div>
            <div className="ml-2">
                <label> Until
                    <div className="ml-2 picker-on-right">
                        <DatePicker
                            onChange={props.timeUntilSelected}
                            value={props.filterData.timeUntil ? new Date(props.filterData.timeUntil) : toMonth}
                            fromMonth={fromMonth}
                            toMonth={toMonth}
                        />
                    </div>
                </label>
            </div>
        </div>
        <div className="clearfix" />
    </div>
);

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListFilterProps> => {
    return {
        filterData: state.reports.reportsFilter,
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ReportsListFilterProps> => {
    return {
        filterPublish: (value: ReportsFilterPublishTypes) => {
            dispatch(reportsActions.filterReports({published: value}))
        },
        timeFromSelected: (time: Date) => {
            dispatch(reportsActions.filterReports({timeFrom: time.toString()}))
        },
        timeUntilSelected: (time: Date) => {
            dispatch(reportsActions.filterReports({timeUntil: time.toString()}))
        }
    }
};

export const ReportsListFilter = connect(mapStateToProps, mapDispatchToProps)(ReportsListFilterComponent);

