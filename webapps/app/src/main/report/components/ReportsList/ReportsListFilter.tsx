import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch, Action } from "redux";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';

import * as moment from "moment";

import {reportsActions} from "../../actions/reportsActions";
import {
    ReportsFilterFields, ReportsFilterPublishTypes,
} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";

interface ReportsListFilterProps {
    filterData: ReportsFilterFields;
    filterPublish: (value: ReportsFilterPublishTypes) => void;
    timeFromSelected: (params: string) => void;
    timeUntilSelected: (params: string) => void;
}

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="">
        <div className="form-group float-left">
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
            <div className="form-check form-check-inline disabled">
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
        <div className="float-right form-inline report-time-filters">
            <div className="ml-2">
                <label> From
                    <div className="ml-2">
                        <DayPickerInput
                            format="ll"
                            onDayChange={props.timeFromSelected}
                            formatDate={formatDate}
                            parseDate={parseDate}
                            dayPickerProps={{
                                firstDayOfWeek: 1
                            }}
                            placeholder="MMM D, YYYYY"
                            value={props.filterData.timeFrom ? moment(props.filterData.timeFrom).format("ll") : undefined}
                            inputProps={{className:"form-control-sm form-control"}}
                        />
                    </div>
                </label>
            </div>
            <div className="ml-2">
                <label> Until
                    <div className="ml-2">
                        <DayPickerInput
                            format="ll"
                            onDayChange={props.timeUntilSelected}
                            formatDate={formatDate}
                            parseDate={parseDate}
                            dayPickerProps={{
                                firstDayOfWeek: 1
                            }}
                            placeholder="MMM D, YYYYY"
                            value={props.filterData.timeFrom ? moment(props.filterData.timeFrom).format("ll") : undefined}
                            inputProps={{className:"form-control-sm form-control"}}
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
        timeFromSelected: (time: any) => {
            dispatch(reportsActions.filterReports({timeFrom: time}))
        },
        timeUntilSelected: (time: any) => {
            dispatch(reportsActions.filterReports({timeUntil: time}))
        }
    }
};

export const ReportsListFilter = connect(mapStateToProps, mapDispatchToProps)(ReportsListFilterComponent);

