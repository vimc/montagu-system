import {longDate} from "../../../../shared/Helpers";
import * as React from "react";
import {Report} from "../../../../shared/models/Generated";
import {FilterGeneric, ReportRow, ReportRowRenderProps} from "../ReportListTable";
import {VersionFilterValue} from "./ReportVersionFilter";
import {InternalLink} from "../../../../shared/components/InternalLink";

export const VersionCell: React.StatelessComponent<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    const value = props.value as BasicVersionDetails;
    const isLatest = props.original && props.original.latest_version == value.version;

    return <InternalLink href={`/${value.name}/${value.version}/`}>
        <div>{longDate(value.date)}<VersionBadge latest={isLatest}/>
            <div className="small">({value.version})</div>
        </div>
    </InternalLink>
};

export const VersionBadge = (props: {latest: Boolean}) => {
    return props.latest ? <span className="badge-info badge float-right">latest</span>
        : <span className="badge-light badge float-right">out-dated</span>;
};

export const versionIdAccessorFunction = (data: Report): BasicVersionDetails => {
    return {name: data.name, version: data.id, date: new Date(data.updated_on)}
};

export const aggregatedVersionFilterMethod = (filter: FilterGeneric<VersionFilterValue>, row: ReportRow) => {

    if (row.subRows) {
        return row.subRows.some(r => versionFilterMethod(filter, r))
    }
    else {
        return versionFilterMethod(filter, row);
    }
};

const versionFilterMethod = (filter: FilterGeneric<VersionFilterValue>, row: ReportRow) => {

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

    const val = props.value as BasicVersionDetails;
    return <span>
                <InternalLink href={`/${val.name}/${val.version}/`}>
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
    name: string,
    version: string,
    date: Date
}