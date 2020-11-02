import {Touchstone} from "../../../../shared/models/Generated";
import * as React from "react";
import {TouchstoneListItem} from "./TouchstoneListItem";
import {shallow} from "enzyme";

export interface TouchstoneTableProps {
    touchstones: Touchstone[];
    showFinished: boolean;
}

export const TouchstoneTable: React.FunctionComponent<TouchstoneTableProps> = (props) => {
    return <table className="table">
        <thead>
        <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Comment</th>
            <th>{props.showFinished ? "Latest version" : "Latest unfinished version"}</th>
        </tr>
        </thead>
        <tbody>
        {props.touchstones.map(t => <TouchstoneListItem showFinished={props.showFinished} key={t.id} {...t} />)}
        </tbody>
    </table>;
};