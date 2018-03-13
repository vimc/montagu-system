import { Dispatch } from "redux";

import { reportsActions } from "./reportsActions";
import {breadcrumbsActions} from "../../shared/actions/breadcrumbsActions";
import {ReportPageComponent, ReportPageLocationProps} from "../components/Reports/ReportPage";

export const reportPageActions = {

    onLoad(props: ReportPageLocationProps) {
        return (dispatch: Dispatch<any>) => {
            dispatch(reportsActions.setCurrentReport(props.report));
            dispatch(reportsActions.getReportVersions(props.report));
            dispatch(reportsActions.getVersionDetails(props.report, props.version));
            dispatch(breadcrumbsActions.createBreadcrumbs(ReportPageComponent.breadcrumb(props)));
        }
    }

};