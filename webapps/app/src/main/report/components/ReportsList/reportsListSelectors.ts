import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { orderBy, clone } from "lodash";
import {Report} from "../../../shared/models/Generated";
import {
    ReportsFilterFields, ReportsFilterPublishTypes,
    ReportsSortingFields
} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {VersionIdentifier} from "../../models/VersionIdentifier";
import {isEqual} from 'lodash';

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
);

export const reportsListSelectors = {

    getRawReportsListSelector: (state: ReportAppState) => state.reports.reports,

    getSortingPropsSelector: (state: ReportAppState) => state.reports.reportsSortBy,

    getFilterPropsSelector: (state: ReportAppState) => state.reports.reportsFilter,

    getSortOrderByReportFieldName: (field: ReportsSortingFields) => field === ReportsSortingFields.name ? 'asc' : 'desc',

    sortReportsList(reports: Report[], sortBy: ReportsSortingFields) {
        return orderBy(reports, [sortBy], [this.getSortOrderByReportFieldName(sortBy)])
    },

    compareVersionAndFilterTime: (version: string, filterTime: string) =>
        (new VersionIdentifier(version)).timestamp.getTime() > Date.parse(filterTime),

    makeReportsDisplayList(reports: Report[], sortBy: ReportsSortingFields, filter: ReportsFilterFields) {
        let displayList = null;
        if (reports) {
            displayList = clone(reports);
            if (filter.published !== ReportsFilterPublishTypes.all) {
                displayList = displayList.filter((item: any) => filter.published === ReportsFilterPublishTypes.published
                    ? item.published
                    : !item.published
                );
            }
            if (filter.timeFrom) {
                displayList = displayList.filter((item: any) =>
                    this.compareVersionAndFilterTime(item.latest_version, filter.timeFrom)
                );
            }
            if (filter.timeUntil) {
                displayList = displayList.filter((item: any) =>
                    !this.compareVersionAndFilterTime(item.latest_version, filter.timeUntil)
                );
            }
            displayList = this.sortReportsList(displayList, sortBy);
        }
        return displayList;
    },

    createDisplayListSelector() {
        return createDeepEqualSelector(
            [ this.getRawReportsListSelector, this.getSortingPropsSelector, this.getFilterPropsSelector],
            (reports: Report[], sortBy: ReportsSortingFields, filter: ReportsFilterFields) =>
                this.makeReportsDisplayList(reports, sortBy, filter)
        );
    }
}


