import { Dispatch } from "redux";

import { reportActionCreators } from "./reportActionCreators";
import {ReportChangelogPublicProps} from "../components/Reports/ReportChangelog";

export const reportVersionChangelogActionCreators = {

    onLoad(props: ReportChangelogPublicProps) {
        return async (dispatch: Dispatch<any>) => {
            dispatch(reportActionCreators.getVersionChangelog(props.report, props.version));
        }

    }

};