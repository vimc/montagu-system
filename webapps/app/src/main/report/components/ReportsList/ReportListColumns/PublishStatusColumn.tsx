import * as React from "react";
import {FilterGeneric, FilterProps, ReportRow, ReportRowRenderProps} from "../ReportListTable";

export const PublishStatusCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    return props.value ?
        <span className="badge-published badge float-left">published</span> :
        <span className="badge-internal badge float-left">internal</span>
};

export const PublishStatusFilter: React.SFC<FilterProps<string>> = (props: FilterProps<string>) => {
    return <select className="form-control"
                   onChange={event => props.onChange(event.target.value)}
                   value={props.filter ? props.filter.value : "all"}>
        <option value="all">All</option>
        <option value="published">Published</option>
        <option value="internal">Internal</option>
    </select>
};

export const aggregatedPublishStatusFilterMethod = (filter: FilterGeneric<string>, row: ReportRow) => {

    if (row._subRows){
        return row._subRows.some(r => publishStatusFilterMethod(filter, r))
    }
    else{
        return publishStatusFilterMethod(filter, row)
    }
};

const publishStatusFilterMethod = (filter: FilterGeneric<string>, row: ReportRow) => {

    const published = row.published;
    if (filter.value === "all") {
        return true;
    }
    if (filter.value === "published") {
        return published;
    }
    return !published;
};
