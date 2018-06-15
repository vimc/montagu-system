import {Touchstone} from "../../../../shared/models/Generated";
import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect} from "react-redux";
import {TouchstoneListItem} from "./TouchstoneListItem";

interface TouchstoneListProps {
    touchstones: Touchstone[]
}

export const TouchstoneListComponent: React.SFC<TouchstoneListProps> = (props: TouchstoneListProps) => {
    return <table>
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

export const mapStateToProps = (state: AdminAppState): TouchstoneListProps => {
    return {
        touchstones: state.touchstones.touchstones
    }
};

export const TouchstoneList = compose(
    connect(mapStateToProps)
)(TouchstoneListComponent) as React.ComponentClass<{}>;