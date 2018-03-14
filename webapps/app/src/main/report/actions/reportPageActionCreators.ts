import { Dispatch } from "redux";

import { reportActionCreators } from "./reportActionCreators";

export const reportPageActionCreators = {

    onLoad(props: any) {
        return (dispatch: Dispatch<any>) => {
            dispatch(reportActionCreators.setCurrentReport(props.report));
            dispatch(reportActionCreators.getReportVersions(props.report));
            dispatch(reportActionCreators.getVersionDetails(props.report, props.version));
        }
    }

};