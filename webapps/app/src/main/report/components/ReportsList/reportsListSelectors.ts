import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { orderBy } from "lodash";
import {Report} from "../../../shared/models/Generated";
import {ReportsSortingFields} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {isEqual} from 'lodash';

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
);

export const reportsListSelectors = {

    getRawReportsListSelector: (state: ReportAppState) => state.reports.reports,

    getSortingPropsSelector: (state: ReportAppState) => state.reports.reportsSortBy,

    getSortOrderByReportFieldName: (field: ReportsSortingFields) => field === ReportsSortingFields.name ? 'asc' : 'desc',

    sortReportsList(reports: Report[], sortBy: ReportsSortingFields) {
        return orderBy(reports, [sortBy], [this.getSortOrderByReportFieldName(sortBy)])
    },

    makeReportsDisplayList(reports: Report[], sortBy: ReportsSortingFields) {
        let displayList = null;
        if (reports) {
            displayList = this.sortReportsList(reports, sortBy);
        }
        return displayList;
    },

    createDisplayListSelector() {
        return createDeepEqualSelector(
            [ this.getRawReportsListSelector, this.getSortingPropsSelector],
            (reports: Report[], sortBy: ReportsSortingFields) => this.makeReportsDisplayList(reports, sortBy)
        );
    }
}

