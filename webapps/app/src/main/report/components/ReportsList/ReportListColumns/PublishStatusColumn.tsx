import * as React from "react";
import {FilterGeneric, FilterProps, ReportRowProps, ReportRowRenderProps} from "../ReportListTable";

export const PublishStatusCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    return props.value ?
        <span className="ml-1 badge-published badge d-none d-sm-inline mr-2">published</span> :
        <span className="ml-1 badge-internal badge d-none d-sm-inline mr-2">internal</span>
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

export const publishStatusFilterMethod = (filter: FilterGeneric<string>, row: ReportRowProps) => {
    const published = row.published;
    if (filter.value === "all") {
        return true;
    }
    if (filter.value === "published") {
        return published;
    }
    return !published;
};