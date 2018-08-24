import {longDate} from "../../../../shared/Helpers";
import * as React from "react";
import {Report} from "../../../../shared/models/Generated";
import {FilterGeneric, ReportRowProps, ReportRowRenderProps} from "../ReportListTable";
import {VersionFilterValue} from "./LatestVersionFilter";
import {InternalLink} from "../../../../shared/components/InternalLink";

export const LinkToReportCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {

    const report = props.row;
    return  <InternalLink href={`/${report.name}/${report.version.version}/`}>
        View report
    </InternalLink>

};

export const VersionCell: React.StatelessComponent<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    const value = props.value as ReportVersion;
    return <div>
        <div>{longDate(value.date)}</div>
        <div className="small">({value.version})</div>
        <LinkToReportCell {...props}/>
    </div>
};

export const versionIdAccessorFunction = (data: Report): ReportVersion => {
    return {version: data.id, date: new Date(data.updated_on)}
};

export const versionFilterMethod = (filter: FilterGeneric<VersionFilterValue>, row: ReportRowProps) => {

    // make sure end date is the end of the day, to get an inclusive date range
    filter.value.end.setHours(23,59,59);

    const lastUpdatedDate = row.version.date;
    const lastVersionId = row.version.version;

    return lastUpdatedDate <= filter.value.end
        && lastUpdatedDate >= filter.value.start &&
        lastVersionId.toLowerCase().indexOf(filter.value.versionId.toLowerCase()) > -1;
};

export const getLatestVersion = (vals: ReportVersion[]):  ReportVersion => {
    return vals.sort(versionSortMethod)[0];
};

export const AggregatedVersionCell: React.StatelessComponent<ReportRowProps> = (row: ReportRowProps) => {
    return <InternalLink href={`/${row.name}/${row.version.version}/`}>
        View report
    </InternalLink>
};

export const versionSortMethod = (a: ReportVersion, b: ReportVersion) => {
    if (a.date > b.date){
        return -1
    }
    return 1
};

export interface ReportVersion {
    version: string,
    date: Date
}