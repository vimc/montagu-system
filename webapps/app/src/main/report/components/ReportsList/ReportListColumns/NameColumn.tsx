import * as React from "react";
import {FilterGeneric} from "../ReportListTable";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {RowInfo} from "react-table";
import {Report} from "../../../../shared/models/Generated";

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
    const report = row._original as Report;
    const value = filter.value.toLowerCase();
    const name = report.name.toLowerCase();
    const displayName = report.display_name && report.display_name.toLowerCase();
    return name.search(value) > -1 || displayName && displayName.search(value) > -1
};