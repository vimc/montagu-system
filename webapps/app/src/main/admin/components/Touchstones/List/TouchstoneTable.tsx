import {Touchstone} from "../../../../shared/models/Generated";
import * as React from "react";
import {TouchstoneListItem} from "./TouchstoneListItem";

export interface TouchstoneTableProps {
    touchstones: Touchstone[];
}

export const TouchstoneTable: React.FunctionComponent<TouchstoneTableProps> = (props) => {
    return <table className="table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Comment</th>
            <th>Latest version</th>
        </tr>
        </thead>
        <tbody>
        {props.touchstones.map(t => <TouchstoneListItem key={t.id} {...t} />)}
        </tbody>
    </table>;
};