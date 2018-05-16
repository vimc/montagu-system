import * as React from "react";
import {Report} from "../../../shared/models/Generated";
import ReactTable, {Column, Filter, FilterRender, ReactTableFunction, RowRenderProps} from 'react-table'
import {
    LatestVersion,
    latestVersionAccessorFunction,
    LatestVersionCell,
    versionFilterMethod
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
                width: 340,
                accessor: latestVersionAccessorFunction,
                Cell: LatestVersionCell,
                filterMethod: versionFilterMethod,
                Filter: ReportLatestVersionFilter
            },
            {
                Header: "Author",
                accessor: "author",
                Filter: TextFilter
            },
            {
                Header: "Requester",
                accessor: "requester",
                Filter: TextFilter
            },
        ];

    if (props.isReviewer) {
        columns.push({
            Header: "Status",
            accessor: "published",
            id: "published",
            width: 110,
            Cell: PublishStatusCell,
            filterMethod: publishStatusFilterMethod,
            Filter: PublishStatusFilter
        })
    }

    return <div>
        <h5 className="mb-5">
            Click on a column heading to sort reports by that field
        </h5>
        <ReactTable
            defaultFilterMethod={(filter: Filter, row: ReportRowProps) =>
                String(row[filter.id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1}
            filterable
            className="-striped -highlight responsive"
            data={props.reports}
            columns={columns}/>
    </div>;
};