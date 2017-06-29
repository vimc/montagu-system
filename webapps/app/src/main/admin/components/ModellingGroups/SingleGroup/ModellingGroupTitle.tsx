import * as React from "react";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { groupStore } from "../../../stores/GroupStore";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";

export interface GroupTitleProps extends RemoteContent {
    group: ModellingGroup;
}

export abstract class ModellingGroupTitle extends RemoteContentComponent<GroupTitleProps> {
    static getStores() {
        return [ groupStore ];
    }
    static getPropsFromStores(): GroupTitleProps {
        const group = groupStore.getCurrentGroupDetails();
        return {
            group: group,
            ready: group != null
        };
    }

    renderLoading() {
        return <span>Loading...</span>;
    }
}