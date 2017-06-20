import * as React from "react";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { groupStore } from "../../../stores/GroupStore";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { isNullOrUndefined } from "util";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";

export interface TitleProps extends RemoteContent {
    group: ModellingGroup;
}

export abstract class ModellingGroupTitle extends RemoteContentComponent<TitleProps> {
    static getStores() {
        return [ groupStore ];
    }
    static getPropsFromStores(): TitleProps {
        const s = groupStore.getState();
        const group = s.groups.find(x => x.id == s.currentGroupId);
        return {
            group: group,
            ready: !isNullOrUndefined(group)
        };
    }
}