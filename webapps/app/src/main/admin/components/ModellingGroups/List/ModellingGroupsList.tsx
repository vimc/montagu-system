import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import { connect } from 'react-redux';
import {clone} from "lodash";

import { ModellingGroup } from "../../../../shared/models/Generated";
import { ModellingGroupListItem } from "./ModellingGroupListItem";

import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {AdminAppState} from "../../../reducers/adminAppReducers";

interface ModellingGroupsProps {
    groups: ModellingGroup[]
}

export const ModellingGroupsListComponent: React.SFC<ModellingGroupsProps> = (props: ModellingGroupsProps) => {
    return <ul>
        {props.groups.map(g => <li key={ g.id }><ModellingGroupListItem {...g} /></li>)}
    </ul>;
};

// TODO: move to reselect later if logic will get more complicated
export const sortAdminModellingGroups = (originalGroups: ModellingGroup[]): ModellingGroup[] => {
    if (!originalGroups || !originalGroups.length) return null;
    // no mutating!
    const groups: ModellingGroup[] = clone(originalGroups);
    return groups.sort((a, b) => a.description.localeCompare(b.description));
}

export const mapStateToProps = (state: AdminAppState): ModellingGroupsProps => {
    return {
        groups: (state.groups.groups && state.groups.groups) ? sortAdminModellingGroups(state.groups.groups) : []
    }
};

export const ModellingGroupsList = compose(
    connect(mapStateToProps),
    branch((props: ModellingGroupsProps) => (!props.groups), renderComponent(LoadingElement))
)(ModellingGroupsListComponent) as React.ComponentClass<Partial<ModellingGroupsProps>>;

