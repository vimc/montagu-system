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
        const group = groupStore.getCurrentGroupDetails();
        return {
            group: group,
            ready: group != null
        };
    }
}