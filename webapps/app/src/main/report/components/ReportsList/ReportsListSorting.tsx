import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch, Action } from "redux";

import {reportsActions} from "../../actions/reportsActions";
import {ReportsSortingFields} from "../../actionTypes/ReportsActionsTypes";

interface ReportsListSortingProps {
    sort: (value: ReportsSortingFields) => void;
}

export const ReportsListSortingComponent: React.StatelessComponent<ReportsListSortingProps> = (props: ReportsListSortingProps) => (
    <div>
        <label>Sorting</label>
        <select onChange={(e : React.ChangeEvent<HTMLSelectElement>) => props.sort(e.target.value as ReportsSortingFields)} >
            <option value=""></option>
            <option value="latest_version">Creation Date</option>
            <option value="name">Name</option>
        </select>
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