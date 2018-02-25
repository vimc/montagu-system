import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch, Action } from "redux";
import * as Datetime from "react-datetime";

// import "../../../../../node_modules/react-datetime/css/react-datetime.css";

import {reportsActions} from "../../actions/reportsActions";
import {
    ReportsFilterFields, ReportsFilterPublishTypes,
    ReportsSortingFields
} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";

interface ReportsListFilterProps {
    filterPublish: (value: ReportsFilterPublishTypes) => void;
    filterData: ReportsFilterFields;
}

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="form-inline">
        <div className="form-group">
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input
                        className="form-check-input"
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
                    /> Not Published
                </label>
            </div>
        </div>
        <div className="form-group ml-2">
            <label> From
                <div className="ml-2">
                    <Datetime dateFormat="DD/MM/YYYY" timeFormat="HH:mm"/>
                </div>
            </label>
        </div>
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
        }
    }
};

export const ReportsListFilter = connect(mapStateToProps, mapDispatchToProps)(ReportsListFilterComponent);