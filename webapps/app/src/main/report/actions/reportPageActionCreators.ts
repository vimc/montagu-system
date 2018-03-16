import { Dispatch } from "redux";

import { reportActionCreators } from "./reportActionCreators";
import {ReportPageComponent} from "../components/Reports/ReportPage";
import {breadcrumbsActions} from "../../shared/actions/breadcrumbsActions";

export const reportPageActionCreators = {

    onLoad(props: any) {
        return (dispatch: Dispatch<any>) => {
            dispatch(reportActionCreators.setCurrentReport(props.report));
            dispatch(reportActionCreators.getReportVersions(props.report));
            dispatch(reportActionCreators.getVersionDetails(props.report, props.version));
            dispatch(breadcrumbsActions.createBreadcrumbs(ReportPageComponent.breadcrumb(props)));
        }
    }

};