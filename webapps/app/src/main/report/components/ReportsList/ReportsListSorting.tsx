import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch, Action } from "redux";

import {reportsActions} from "../../actions/reportsActions";
import {ReportsSortingFields} from "../../actionTypes/ReportsActionsTypes";

interface ReportsListSortingProps {
    sort: (value: ReportsSortingFields) => void;
}

export const ReportsListSortingComponent: React.StatelessComponent<ReportsListSortingProps> = (props: ReportsListSortingProps) => (
    <div className="form-inline">
        <div className="form-group">
            <label>Sort by</label>
            <select className="form-control" onChange={(e : React.ChangeEvent<HTMLSelectElement>) => props.sort(e.target.value as ReportsSortingFields)} >
                <option value="name">Name</option>
                <option value="latest_version">Creation Date</option>
            </select>
        </div>
    </div>
)

export const mapDispatchToProps = (dispatch: Dispatch<Action>): ReportsListSortingProps => {
    return {
        sort: (value: ReportsSortingFields) => {
            dispatch(reportsActions.sortReports(value))
        }
    }
};

export const ReportsListSorting = connect(state=>state, mapDispatchToProps)(ReportsListSortingComponent);