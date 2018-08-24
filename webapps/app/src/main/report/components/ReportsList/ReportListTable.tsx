import * as React from "react";
import {Report} from "../../../shared/models/Generated";
import ReactTable, {Column, Filter, FilterRender, ReactTableFunction, RowRenderProps} from 'react-table'

import {
    AggregatedVersionCell,
    BasicVersionDetails, getLatestVersion,
    VersionCell,
    aggregatedVersionFilterMethod, versionIdAccessorFunction,
    versionSortMethod
} from "./ReportListColumns/VersionColumn";
import {
    PublishStatusCell,
    PublishStatusFilter,
    aggregatedPublishStatusFilterMethod
} from "./ReportListColumns/PublishStatusColumn";
import {ReportVersionFilter} from "./ReportListColumns/ReportVersionFilter";
import {nameAccessorFunction} from "./ReportListColumns/NameColumn";

export interface ReportsListTableProps {
    reports: Report[]
    isReviewer: boolean;
}

export interface ReportRowRenderProps extends RowRenderProps {
    row: ReportRow,
    value: string | BasicVersionDetails | boolean;
}

export interface ReportRow {
    version: BasicVersionDetails,
    name: string,
    author: string,
    requester: string,
    published?: boolean,

    [key: string]: string | boolean | BasicVersionDetails | ReportRow[]

    _subRows?: ReportRow[]
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

export const EmptyCell = () => {
    return <span>&nbsp;</span>
};

export const NonEmptyCell = (row: ReportRowRenderProps) => {
    return <span>{row.value}</span>
};

const getFirstOfAggregatedValues = (vals: any) => vals[0];

export const ReportsListTable: React.StatelessComponent<ReportsListTableProps>
    = (props: ReportsListTableProps) => {

    // Note: if these column headers change, you must also change ./styles/report-table.scss
    // where the headers are hard-coded for small devices
    const columns: Column[] =
        [
            {
                Header: "Name",
                id: "name",
                accessor: nameAccessorFunction,
                Filter: TextFilter
            },
            {
                Header: "Author",
                accessor: "author",
                width: 220,
                Filter: TextFilter,
                Cell: EmptyCell,
                Aggregated: NonEmptyCell,
                aggregate: getFirstOfAggregatedValues,
            },
            {
                Header: "Requester",
                accessor: "requester",
                width: 220,
                Cell: EmptyCell,
                Filter: TextFilter,
                Aggregated: NonEmptyCell,
                aggregate: getFirstOfAggregatedValues,
            },
            {
                Header: "Version",
                id: "version",
                Cell: VersionCell,
                width: 345,
                accessor: versionIdAccessorFunction,
                sortMethod: versionSortMethod,
                filterMethod: aggregatedVersionFilterMethod,
                Filter: ReportVersionFilter,
                aggregate: getLatestVersion,
                Aggregated: AggregatedVersionCell
            },
        ];

    if (props.isReviewer) {
        columns.push({
            Header: "Status",
            accessor: "published",
            id: "published",
            width: 120,
            Cell: PublishStatusCell,
            filterMethod: aggregatedPublishStatusFilterMethod,
            Filter: PublishStatusFilter,
            aggregate: _ => null,
            Aggregated: EmptyCell,
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
            pivotBy={["name"]}
            defaultSorted={[{id: "version"}]}
            defaultFilterMethod={(filter: Filter, row: ReportRow) =>
                String(row[filter.id]).toLowerCase().indexOf(filter.value.toLowerCase()) > -1}
            filterable
            defaultPageSize={10}
            className="-striped -highlight responsive"
            data={props.reports}
            columns={columns}/>
    </div>;
};