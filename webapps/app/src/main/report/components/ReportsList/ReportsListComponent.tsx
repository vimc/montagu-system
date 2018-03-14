import * as React from "react";

import {ReportListItem} from "./ReportListItem";
import { Report } from "../../../shared/models/Generated";

export interface ReportsListComponentProps {
    reports: Report[]
}

export const ReportsListComponent : React.StatelessComponent<ReportsListComponentProps> = (props: ReportsListComponentProps) => (
    <ul className="list-unstyled">
        {props.reports.map((report: Report) => (
            <ReportListItem key={report.name} {...report} />
        ))}
    </ul>
);