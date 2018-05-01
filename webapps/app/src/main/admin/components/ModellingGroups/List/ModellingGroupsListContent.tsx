import * as React from "react";
import {compose} from "recompose";
import { connect } from 'react-redux';
import {clone} from "lodash";

import { ModellingGroup } from "../../../../shared/models/Generated";
import { ModellingGroupListItem } from "./ModellingGroupListItem";

import {AdminAppState} from "../../../reducers/adminAppReducers";

interface ModellingGroupsProps {
    groups: ModellingGroup[]
}

export const ModellingGroupsListContentComponent: React.SFC<ModellingGroupsProps> = (props: ModellingGroupsProps) => {
    if (Array.isArray(props.groups) && props.groups.length) {
        return <ul>
            {props.groups.map(g => <li key={g.id}><ModellingGroupListItem {...g} /></li>)}
        </ul>;
    } else {
        return null;
    }
};

// TODO: move to reselect later if logic will get more complicated
export const sortAdminModellingGroups = (originalGroups: ModellingGroup[]): ModellingGroup[] => {
    if (!originalGroups || !originalGroups.length) return [];
    // no mutating!
    const groups: ModellingGroup[] = clone(originalGroups);
    return groups.sort((a, b) => a.description.localeCompare(b.description));
}

export const mapStateToProps = (state: AdminAppState): ModellingGroupsProps => {
    return {
        groups: (state.groups.groups && state.groups.groups) ? sortAdminModellingGroups(state.groups.groups) : []
    }
};

export const ModellingGroupsListContent = compose(
    connect(mapStateToProps)
)(ModellingGroupsListContentComponent) as React.ComponentClass<Partial<ModellingGroupsProps>>;

