import * as React from "react";
import { ModellingGroup } from "../../models/Generated";
import { RemoteContent } from "../../stores/RemoteContent";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { GroupLink, GroupLinkProps } from "./GroupLink";

const chooseStyles = require("./Choose.css");

export interface GroupListProps extends RemoteContent {
    groups: ModellingGroup[];
    selected: ModellingGroup;
}

export class GroupList extends React.Component<GroupListProps, undefined> {
    static getStores() {
        return [ responsibilityStore, contribAuthStore ];
    }

    static getPropsFromStores(): GroupListProps {
        const state = responsibilityStore.getState();
        return {
            groups: contribAuthStore.getState().modellingGroups,
            selected: state.currentModellingGroup,
            ready: state.ready
        };
    }

    private getLinkProps(group: ModellingGroup): GroupLinkProps {
        return {
            group: group,
            selected: this.props.selected == group
        };
    }

    render(): JSX.Element {
        const items = this.props.groups.map((group: ModellingGroup) =>
            <li key={ group.id }>
                <GroupLink { ...this.getLinkProps(group) } />
            </li>
        );
        return <ul className={ chooseStyles.list }>{ items }</ul>
    }
}