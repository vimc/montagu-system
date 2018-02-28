import { createSelector } from "reselect";
import { orderBy } from "lodash";
import {Report} from "../../../shared/models/Generated";
import {
    ReportsFilterFields, ReportsFilterPublishTypes,
    ReportsSortingFields
} from "../../actionTypes/ReportsActionsTypes";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {VersionIdentifier} from "../../models/VersionIdentifier";

export const getReportsListSelector = (state: ReportAppState) => state.reports.reports;

export const getSortingPropsSelector = (state: ReportAppState) => state.reports.reportsSortBy;

export const getFilterPropsSelector = (state: ReportAppState) => state.reports.reportsFilter;

export const getDisplayedReportsListSelector = createSelector(
    [ getReportsListSelector, getSortingPropsSelector, getFilterPropsSelector],
    ( reports: Report[], sorting: ReportsSortingFields, filter: ReportsFilterFields) => {
        if (reports) {
            let displayReports = reports;
            if (filter.published !== ReportsFilterPublishTypes.all) {
                displayReports = displayReports.filter((item: any) => filter.published === ReportsFilterPublishTypes.published
                    ? item.published
                    : !item.published
                );
            }
            if (filter.timeFrom) {
                displayReports = displayReports.filter((item: any) =>
                    compareVersionAndFilterTime(item.latest_version, filter.timeFrom)
                );
            }
            if (filter.timeUntil) {
                displayReports = displayReports.filter((item: any) =>
                    compareVersionAndFilterTime(item.latest_version, filter.timeUntil)
                );
            }
            return sortReportsList(displayReports, sorting);
        }
    }
);

const getSortOrderByReportFieldName = (field: ReportsSortingFields) => field === ReportsSortingFields.name ? 'asc' : 'desc';

export const sortReportsList = (reports: Report[], sortBy: ReportsSortingFields) => {
    return orderBy(reports, [sortBy], [getSortOrderByReportFieldName(sortBy)]);
};

export const compareVersionAndFilterTime = (version: string, filterTime: string) =>
    (new VersionIdentifier(version)).timestamp.getTime() > Date.parse(filterTime);

