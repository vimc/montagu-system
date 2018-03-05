import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch, Action } from "redux";

import {reportsActions} from "../../actions/reportsActions";
import {ReportsSortingFields} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";

interface ReportsListSortingProps {
    sort: (value: ReportsSortingFields) => void;
    sortBy: ReportsSortingFields;
}

export const ReportsListSortingComponent: React.StatelessComponent<ReportsListSortingProps> = (props: ReportsListSortingProps) => (
    <div className="form-inline mb-5">
        <div className="form-group">
            <label className="mr-2">Sort by</label>
            <select
                className="form-control-sm form-control"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => props.sort(e.target.value as ReportsSortingFields)}
                value={props.sortBy}
            >
                <option value="name">Name</option>
                <option value="latest_version">Creation Date</option>
            </select>
        </div>
    </div>
);

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListSortingProps> => {
    return {
        sortBy: state.reports.reportsSortBy
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ReportsListSortingProps> => {
    return {
        sort: (value: ReportsSortingFields) => {
            dispatch(reportsActions.sortReports(value))
        }
    }
};

export const ReportsListSorting = connect(mapStateToProps, mapDispatchToProps)(ReportsListSortingComponent);