import * as React from "react";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { connectToStores } from "../../../shared/alt";
import { GroupList } from "./GroupList";
import { RemoteContentComponent } from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../shared/models/RemoteContent";

const commonStyles = require("../../../shared/styles/common.css");

export interface ChooseGroupProps extends RemoteContent {
    groups: ModellingGroup[]
}

export class ChooseGroupContentComponent extends RemoteContentComponent<ChooseGroupProps> {
    static getStores() {
        return [ responsibilityStore, contribAuthStore ];
    }
    static getPropsFromStores(): ChooseGroupProps {
        const groups = contribAuthStore.getState().modellingGroups;
        if (groups.length == 1) {
            console.log("Redirecting");
            (this as any).context.redirectTo(`/${groups[0].id}/`)
        }
        return {
            groups: groups,
            ready: groups && groups.length > 1
        };
    }

    renderContent(props: ChooseGroupProps) {
        return <div>
            <div>
                You are a member of multiple modelling groups.
                Which one do you want to act as currently?
            </div>
            <div className={ commonStyles.gapAbove }>
                <GroupList groups={ props.groups } />
            </div>
        </div>;
    }
}

export const ChooseGroupContent = connectToStores(ChooseGroupContentComponent);