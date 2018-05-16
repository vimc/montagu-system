import {longDate} from "../../../../shared/Helpers";
import * as React from "react";
import {Report} from "../../../../shared/models/Generated";
import {FilterGeneric, ReportRowProps, ReportRowRenderProps} from "../ReportListTable";
import {VersionFilterValue} from "./LatestVersionFilter";

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

export const versionFilterMethod = (filter: FilterGeneric<VersionFilterValue>, row: ReportRowProps) => {
    const lastUpdatedDate = row.latest_version.date;
    const lastVersionId = row.latest_version.version;

    return lastUpdatedDate <= filter.value.end
        && lastUpdatedDate >= filter.value.start &&
        lastVersionId.indexOf(filter.value.versionId) > -1;
};

export interface LatestVersion {
    version: string,
    date: Date
}