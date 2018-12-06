import { Dispatch } from "redux";

import { reportActionCreators } from "./reportActionCreators";
import {ReportPageComponent, ReportPageLocationProps} from "../components/Reports/ReportPage";
import {breadcrumbsActionCreators} from "../../shared/actions/breadcrumbsActionsCreators";
import {ReportTypeKeys, ReportVersionDetailssFetched, ReportVersionChangelogFetched} from "../actionTypes/ReportsActionsTypes";

export const reportPageActionCreators = {

    onLoad(props: ReportPageLocationProps) {
        return async (dispatch: Dispatch<any>) => {            
            dispatch(reportActionCreators.setCurrentReport(props.report));
            dispatch({
                type: ReportTypeKeys.REPORT_VERSION_DETAILS_FETCHED,
                data: null
            } as ReportVersionDetailssFetched);
            dispatch({
                type: ReportTypeKeys.REPORT_VERSION_CHANGELOG_FETCHED,
                data: null
            } as ReportVersionChangelogFetched);

            dispatch(reportActionCreators.getReportVersions(props.report));
            dispatch(reportActionCreators.getVersionDetails(props.report, props.version));
            dispatch(reportActionCreators.getVersionChangelog(props.report, props.version));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ReportPageComponent.breadcrumb(props)));
        }
    }

};