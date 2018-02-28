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
    timeFromSelected: (params: any) => void;
    timeUntilSelected: (params: any) => void;
}

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="form-inline">
        <div className="form-group">
            
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
                        onDayChange={(day:any) => console.log(day)}
                        formatDate={formatDate}
                        parseDate={parseDate}
                        dayPickerProps={{
                            firstDayOfWeek: 1
                        }}
                        placeholder="MMM D, YYYYY"
                        inputProps={{className:"form-control-sm form-control"}}
                    />
                </div>
            </label>
        </div>
    </div>
);

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListFilterProps> => {
    console.log(state.reports.reportsFilter);
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
        timeUntilSelected: (params: any) => {
            dispatch(reportsActions.filterReports({timeUntil: params.format("LL")}))
        }
    }
};

export const ReportsListFilter = connect(mapStateToProps, mapDispatchToProps)(ReportsListFilterComponent);

