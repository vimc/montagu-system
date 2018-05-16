import {longDate} from "../../../../shared/Helpers";
import * as React from "react";
import {Report} from "../../../../shared/models/Generated";
import {ReportRowRenderProps} from "../ReportListTable";

export const LatestVersionCell: React.StatelessComponent<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    const value = props.value as LatestVersion;
    return <div className="small">
        <div>{value.version}</div>
        <div>({longDate(value.date)})</div>
    </div>
};

export const latestVersionAccessorFunction = (data: Report): LatestVersion => {
    return {version: data.latest_version, date: new Date(data.updated_on)}
};

export interface LatestVersion {
    version: string,
    date: Date
}