import * as React from "react";

import {ReportListItem} from "./ReportListItem";
import {Report} from "../../../shared/models/Generated";
import {ReportsListTable} from "./ReportListTable";

export interface ReportsListComponentProps {
    reports: Report[],
    isReviewer: boolean
}

export const ReportsListComponent: React.StatelessComponent<ReportsListComponentProps>
    = (props: ReportsListComponentProps) => {
    if (location.search.length) {
        return <ReportsListTable reports={props.reports} isReviewer={props.isReviewer}/>
    }
    else {
        return <ul className="list-unstyled">
            {props.reports.map((report: Report) => (
                <ReportListItem key={report.name} {...report} />
            ))}
        </ul>
    }
};