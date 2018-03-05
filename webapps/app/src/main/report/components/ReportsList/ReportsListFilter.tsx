import * as React from "react";
import {connect} from 'react-redux';
import {Action, Dispatch} from "redux";

import {reportsActions} from "../../actions/reportsActions";

import {ReportsFilterFields, ReportsFilterPublishTypes,} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {DatePicker} from "../../../shared/components/DatePicker/DatePicker";

interface ReportsListFilterProps {
    filterData: ReportsFilterFields;
    filterPublish: (value: ReportsFilterPublishTypes) => void;
    timeFromSelected: (date: Date) => void;
    timeUntilSelected: (date: Date) => void;
}

const fromMonth = new Date("2017-03-01T00:00:00");
const toMonth = new Date;

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="row">
        <div className="col-12 col-lg-6 form-inline">
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input
                        className="form-check-input form-control form-control-sm"
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
        <div className={"col-12 col-lg-6"}>
            <div className="float-md-right report-time-filters">
                <div className={"row"}>
                    <div className="col">
                        <label className={"mb-0 small font-weight-bold"}>From</label>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                 <svg viewBox="0 0 14 16" width="14" height="16"
                                      aria-hidden="true">
                        <path fillRule="evenodd"
                              d="M13 2h-1v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H6v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h11v9zM5 3H4V1h1v2zm6 0h-1V1h1v2zM6 7H5V6h1v1zm2 0H7V6h1v1zm2 0H9V6h1v1zm2 0h-1V6h1v1zM4 9H3V8h1v1zm2 0H5V8h1v1zm2 0H7V8h1v1zm2 0H9V8h1v1zm2 0h-1V8h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1zm2 0h-1v-1h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1z">
                        </path></svg>
                            </span>
                            </div>
                            <DatePicker
                                onChange={props.timeFromSelected}
                                value={props.filterData.timeFrom ? new Date(props.filterData.timeFrom) : fromMonth}
                                fromMonth={fromMonth}
                                toMonth={toMonth}
                            />
                        </div>
                    </div>
                    <div className="col">
                        <label className={"mb-0 small font-weight-bold"}> Until</label>
                        <div className="input-group mb-3 picker-on-right">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                 <svg viewBox="0 0 14 16" width="14" height="16"
                                      aria-hidden="true">
                        <path fillRule="evenodd"
                              d="M13 2h-1v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H6v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h11v9zM5 3H4V1h1v2zm6 0h-1V1h1v2zM6 7H5V6h1v1zm2 0H7V6h1v1zm2 0H9V6h1v1zm2 0h-1V6h1v1zM4 9H3V8h1v1zm2 0H5V8h1v1zm2 0H7V8h1v1zm2 0H9V8h1v1zm2 0h-1V8h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1zm2 0h-1v-1h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1z">
                        </path></svg>
                            </span>
                            </div>
                            <DatePicker
                                onChange={props.timeUntilSelected}
                                value={props.filterData.timeUntil ? new Date(props.filterData.timeUntil) : toMonth}
                                fromMonth={fromMonth}
                                toMonth={toMonth}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="clearfix"/>
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

