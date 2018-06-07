import {Touchstone} from "../../../../shared/models/Generated";
import * as React from "react";
import {groupBy, isNullOrEmptyArray} from "../../../../shared/Helpers";
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
            <th>Name</th>
            <th>Latest version</th>
        </tr>
        </thead>
        <tbody>
        {props.touchstones.map(t => <TouchstoneListItem key={t.name} {...t} />)}
        </tbody>
    </table>;
};

function getTouchstonesFromVersions(touchstones: Touchstone[]): Touchstone[] {
    if (isNullOrEmptyArray(touchstones)) {
        return [];
    }
    return groupBy(touchstones, t => t.name).map(g => {
        g.values.sort(t => t.version);
        return g.values[0];
    });
}

export const mapStateToProps = (state: AdminAppState): TouchstoneListProps => {
    return {
        touchstones: getTouchstonesFromVersions(state.touchstones.touchstones)
    }
};

export const TouchstoneList = compose(
    connect(mapStateToProps)
)(TouchstoneListComponent) as React.ComponentClass<{}>;