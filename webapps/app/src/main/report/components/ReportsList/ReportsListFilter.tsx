import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch, Action } from "redux";

import {reportsActions} from "../../actions/reportsActions";
import {ReportsFilterFields} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";

interface ReportsListFilterProps {
    filter: (value: ReportsFilterFields) => void;
    filterData: ReportsFilterFields;
}

export const ReportsListFilterComponent: React.StatelessComponent<ReportsListFilterProps> = (props: ReportsListFilterProps) => (
    <div className="form-inline">
        <div className="form-group">
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" /> All
                </label>
            </div>
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" /> Published
                </label>
            </div>
            <div className="form-check form-check-inline disabled">
                <label className="form-check-label">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" /> Not Published
                </label>
            </div>
        </div>
    </div>
);

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListFilterProps> => {
    return {
        filterData: state.reports.reportsFilter
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ReportsListFilterProps> => {
    return {
        filter: (value: ReportsFilterFields) => {
            dispatch(reportsActions.filterReports(value))
        }
    }
};

export const ReportsListFilter = connect(mapStateToProps, mapDispatchToProps)(ReportsListFilterComponent);