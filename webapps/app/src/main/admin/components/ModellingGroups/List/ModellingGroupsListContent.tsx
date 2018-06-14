import * as React from "react";
import {compose} from "recompose";
import { connect } from 'react-redux';
import {orderBy} from "lodash";

import { ModellingGroup } from "../../../../shared/models/Generated";
import { ModellingGroupListItem } from "./ModellingGroupListItem";

import {AdminAppState} from "../../../reducers/adminAppReducers";
import {isNonEmptyArray} from "../../../../shared/ArrayHelpers";

interface ModellingGroupsProps {
    groups: ModellingGroup[]
}

export const ModellingGroupsListContentComponent: React.SFC<ModellingGroupsProps> = (props: ModellingGroupsProps) => {
    if (props && isNonEmptyArray(props.groups)) {
        return <ul>
            {props.groups.map(g => <li key={g.id}><ModellingGroupListItem {...g} /></li>)}
        </ul>;
    } else {
        return null;
    }
};

// TODO: move to reselect later if logic will get more complicated
export const sortAdminModellingGroups = (originalGroups: ModellingGroup[]): ModellingGroup[] => {
    if (!isNonEmptyArray(originalGroups)) {
        return [];
    }
    return orderBy(originalGroups, ['description'], ['asc']);
}

export const mapStateToProps = (state: AdminAppState): ModellingGroupsProps => {
    return {
        groups: sortAdminModellingGroups(state.groups.groups)
    }
};

export const ModellingGroupsListContent = compose(
    connect(mapStateToProps)
)(ModellingGroupsListContentComponent) as React.ComponentClass<Partial<ModellingGroupsProps>>;

