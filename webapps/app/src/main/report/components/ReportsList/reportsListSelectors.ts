import { createSelector } from "reselect";
import { orderBy } from "lodash";
import {Report} from "../../../shared/models/Generated";
import {ReportsSortingFields} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";

export const getReportsListSelector = (state: ReportAppState) => state.reports.reports;

export const getSortingPropsSelector = (state: ReportAppState) => state.reports.reportsSortBy;

export const getDisplayedReportsListSelector = createSelector(
    [ getReportsListSelector, getSortingPropsSelector],
    ( reports: Report[], sorting: ReportsSortingFields) => {
        if (reports) {
            return sortReportsList(reports, sorting);
        }
    }
);

const getSortOrderByReportFieldName = (field: ReportsSortingFields) => field === ReportsSortingFields.name ? 'asc' : 'desc';

export const sortReportsList = (reports: Report[], sortBy: ReportsSortingFields) => {
    return orderBy(reports, [sortBy], [getSortOrderByReportFieldName(sortBy)]);
};

