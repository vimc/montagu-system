import {longDate} from "../../../../shared/Helpers";
import * as React from "react";
import {Report} from "../../../../shared/models/Generated";
import {FilterGeneric, ReportRow, ReportRowRenderProps} from "../ReportListTable";
import {VersionFilterValue} from "./ReportVersionFilter";
import {InternalLink} from "../../../../shared/components/InternalLink";

export const LinkToReportCell: React.SFC<ReportRow> = (props: ReportRow) => {

    const report = props;
    return <InternalLink href={`/${report.name}/${report.version.version}/`}>
        View version
    </InternalLink>

};

export const VersionCell: React.StatelessComponent<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    const value = props.value as BasicVersionDetails;
    return <div>
        <div>{longDate(value.date)}</div>
        <div className="small">({value.version})</div>
        <LinkToReportCell {...props.row}/>
    </div>
};

export const versionIdAccessorFunction = (data: Report): BasicVersionDetails => {
    return {version: data.id, date: new Date(data.updated_on)}
};

export const versionFilterMethod = (filter: FilterGeneric<VersionFilterValue>, row: ReportRow) => {

    // make sure end date is the end of the day, to get an inclusive date range
    filter.value.end.setHours(23, 59, 59);

    const lastUpdatedDate = row.version.date;
    const lastVersionId = row.version.version;

    return lastUpdatedDate <= filter.value.end
        && lastUpdatedDate >= filter.value.start &&
        lastVersionId.toLowerCase().indexOf(filter.value.versionId.toLowerCase()) > -1;
};

export const getLatestVersion = (vals: BasicVersionDetails[]): BasicVersionDetails => {
    return vals.sort(versionSortMethod)[0];
};

export const AggregatedVersionCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    const report = props.row;
    const val = props.value as BasicVersionDetails;
    return <span>
                <InternalLink href={`/${report.name}/${val.version}/`}>
                    View latest version
                </InternalLink>
                <div className={"small"}>({val.version})</div>
        </span>
};

export const versionSortMethod = (a: BasicVersionDetails, b: BasicVersionDetails) => {
    if (a.date > b.date) {
        return -1
    }
    return 1
};

export interface BasicVersionDetails {
    version: string,
    date: Date
}