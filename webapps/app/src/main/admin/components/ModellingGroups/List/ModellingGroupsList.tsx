import * as React from "react";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { groupStore } from "../../../stores/GroupStore";
import { connectToStores } from "../../../../shared/alt";
import { ModellingGroupListItem } from "./ModellingGroupListItem";

interface ModellingGroupsProps extends RemoteContent {
    groups: ModellingGroup[]
}

export class ModellingGroupsListComponent extends RemoteContentComponent<ModellingGroupsProps, undefined> {
    static getStores() {
        return [ groupStore ];
    }
    static getPropsFromStores(): ModellingGroupsProps {
        const s = groupStore.getState();
        return {
            groups: s.groups,
            ready: s.ready
        };
    }

    renderContent(props: ModellingGroupsProps) {
        const items = props.groups
            .sort((a, b) => a.description.localeCompare(b.description))
            .map(g => <li key={ g.id }>
            <ModellingGroupListItem {...g} />
        </li>);
        return <ul>
            { items }
        </ul>;
    }
}

export const ModellingGroupsList = connectToStores(ModellingGroupsListComponent);