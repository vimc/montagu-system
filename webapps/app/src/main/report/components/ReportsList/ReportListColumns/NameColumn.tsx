import * as React from "react";
import {FilterGeneric} from "../ReportListTable";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {RowInfo} from "react-table";
import {ReportVersion} from "../../../../shared/models/Generated";

export const NameCell: React.SFC<RowInfo> = (props: RowInfo) => {

    const report = props.row;
    const latestReportVersion = props.subRows[0]._original;
    const name = latestReportVersion.display_name ?
        latestReportVersion.display_name : latestReportVersion.name;

    const numVersions = props.subRows.length;

    return <span>
        <span className={"name"}>{name}</span>
        <br/>
        <span className={"text-muted ml-4"} >{numVersions} version{numVersions > 1 ? "s" : ""}: </span>
        <InternalLink href={`/${report.name}/${report.version.version}/`}>
            view latest
        </InternalLink>
    </span>
};

export const aggregatedNameFilterMethod = (filter: FilterGeneric<string>, row: RowInfo) => {

    if (row.subRows) {
        return row.subRows.some(r => nameFilterMethod(filter, r))
    }
    else {
        return nameFilterMethod(filter, row);
    }
};

const nameFilterMethod = (filter: FilterGeneric<string>, row: any) => {
    const reportVersion = row._original as ReportVersion;
    const value = filter.value.toLowerCase();
    const name = reportVersion.name.toLowerCase();
    const displayName = reportVersion.display_name && reportVersion.display_name.toLowerCase();
    return name.search(value) > -1 || displayName && displayName.search(value) > -1
};