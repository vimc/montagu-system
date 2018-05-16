import * as React from "react";
import {Report} from "../../../shared/models/Generated";
import ReactTable, {Column, RowRenderProps} from 'react-table'
import {LatestVersion, latestVersionAccessorFunction, LatestVersionCell} from "./ReportListColumns/VersionColumn";
import {PublishStatusCell} from "./ReportListColumns/PublishStatusColumn";
import {nameAccessorFunction, NameCell} from "./ReportListColumns/NameColumn";

export interface ReportsListTableProps {
    reports: Report[]
    isReviewer: boolean;
}

export interface ReportRowRenderProps extends RowRenderProps {
    original: Report,
    value: string | LatestVersion | boolean;
}

export const ReportsListTable: React.StatelessComponent<ReportsListTableProps>
    = (props: ReportsListTableProps) => {

    const columns: Column[] =
        [
            {
                Header: "Name",
                id: "name",
                Cell: NameCell,
                accessor: nameAccessorFunction
            },
            {
                Header: "Latest version",
                id: "latest_version",
                accessor: latestVersionAccessorFunction,
                Cell: LatestVersionCell
            },
            {
                Header: "Author",
                accessor: "author"
            },
            {
                Header: "Requester",
                accessor: "requester"
            },
        ];

    if (props.isReviewer) {
        columns.push({
            Header: "Status",
            accessor: "published",
            id: "published",
            width: 110,
            Cell: PublishStatusCell
        })
    }

    return <div>
        <h5 className="mb-5">
            Click on a column heading to sort reports by that field
        </h5>
        <ReactTable
            filterable
            className="-striped -highlight responsive"
            data={props.reports}
            columns={columns}/>
    </div>;
};