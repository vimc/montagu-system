import * as React from "react";
import {Report} from "../../../shared/models/Generated";
import ReactTable, {Column, Filter, FilterRender, ReactTableFunction, RowRenderProps} from 'react-table'
import {
    LatestVersion,
    latestVersionAccessorFunction,
    LatestVersionCell,
    versionFilterMethod,
    versionSortMethod
} from "./ReportListColumns/VersionColumn";
import {
    PublishStatusCell,
    PublishStatusFilter,
    publishStatusFilterMethod
} from "./ReportListColumns/PublishStatusColumn";
import {ReportLatestVersionFilter} from "./ReportListColumns/LatestVersionFilter";
import {nameAccessorFunction, NameCell} from "./ReportListColumns/NameColumn";

export interface ReportsListTableProps {
    reports: Report[]
    isReviewer: boolean;
}

export interface ReportRowRenderProps extends RowRenderProps {
    original: Report,
    value: string | LatestVersion | boolean;
}

export interface ReportRowProps {
    latest_version: LatestVersion,
    name: string,
    author: string,
    requester: string,
    published: boolean,

    [key: string]: string | boolean | LatestVersion
}

export interface FilterGeneric<T> extends Filter {
    value: T
}

export interface FilterProps<T> {
    filter?: FilterGeneric<T>,
    onChange: ReactTableFunction
}

export const TextFilter: FilterRender = (props: FilterProps<string>) => {

    const value = props.filter ? props.filter.value : "";

    return <input type={"text"} className={"form-control mb-1 "} value={value}
                  placeholder="Type to filter..."
                  onChange={event => props.onChange(event.target.value)}/>
};

export const ReportsListTable: React.StatelessComponent<ReportsListTableProps>
    = (props: ReportsListTableProps) => {

    // Note: if these column headers change, you must also change ./styles/report-table.scss
    // where the headers are hard-coded for small devices
    const columns: Column[] =
        [
            {
                Header: "Name",
                id: "name",
                Cell: NameCell,
                accessor: nameAccessorFunction,
                Filter: TextFilter
            },
            {
                Header: "Latest version",
                id: "latest_version",
                width: 345,
                accessor: latestVersionAccessorFunction,
                Cell: LatestVersionCell,
                sortMethod: versionSortMethod,
                filterMethod: versionFilterMethod,
                Filter: ReportLatestVersionFilter
            },
            {
                Header: "Author",
                accessor: "author",
                width: 220,
                Filter: TextFilter
            },
            {
                Header: "Requester",
                accessor: "requester",
                width: 220,
                Filter: TextFilter
            },
        ];

    if (props.isReviewer) {
        columns.push({
            Header: "Status",
            accessor: "published",
            id: "published",
            width: 120,
            Cell: PublishStatusCell,
            filterMethod: publishStatusFilterMethod,
            Filter: PublishStatusFilter
        })
    }

    return <div>
        <h1 className="h3 mb-3">
            Find a report
        </h1>
        <p className="helper-text text-muted">
            Click on a column heading to sort by that field. Hold shift to multi-sort.
        </p>
        <ReactTable
            defaultSorted={[{id: "latest_version"}]}
            defaultFilterMethod={(filter: Filter, row: ReportRowProps) =>
                String(row[filter.id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1}
            filterable
            defaultPageSize={10}
            className="-striped -highlight responsive"
            data={props.reports}
            columns={columns}/>
    </div>;
};