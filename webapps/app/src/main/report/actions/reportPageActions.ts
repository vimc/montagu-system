import { Dispatch } from "redux";

import { reportsActions } from "./reportsActions";

export const reportPageActions = {

    onLoad(props: any) {
        return (dispatch: Dispatch<any>) => {
            dispatch(reportsActions.setCurrentReport(props.report));
            dispatch(reportsActions.setCurrentVersion(props.version));
            dispatch(reportsActions.getReportVersions(props.report));
            dispatch(reportsActions.getVersionDetails(props.report, props.version));
        }
    }

};