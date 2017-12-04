import * as React from "react";
import { ModellingGroup } from "../../../shared/models/Generated";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { connectToStores } from "../../../shared/alt";
import { GroupList } from "./GroupList";
import { RemoteContentComponent } from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { RemoteContent } from "../../../shared/models/RemoteContent";
import { InternalLink } from "../../../shared/components/InternalLink";
import { ButtonLink } from "../../../shared/components/ButtonLink";

const commonStyles = require("../../../shared/styles/common.css");

export interface ChooseGroupProps extends RemoteContent {
    groups: ModellingGroup[];
}

export class ChooseGroupContentComponent extends RemoteContentComponent<ChooseGroupProps, undefined> {
    static getStores() {
        return [ responsibilityStore, contribAuthStore ];
    }
    static getPropsFromStores(): ChooseGroupProps {
        const groups = contribAuthStore.getState().modellingGroups;
        return {
            groups: groups,
            ready: groups != null && groups.length > 0// && groups.length > 1
        };
    }

    /*componentDidMount() {
        if (this.props.groups.length == 1) {
            console.log("Redirecting");
            const group = this.props.groups[0];
            this.props.router.redirectTo(`/${group.id}/`, false);
        }
    }*/

    renderContent(props: ChooseGroupProps) {
        if (props.groups.length > 1) {
            return <div>
                <div>
                    You are a member of multiple modelling groups.
                    Which one do you want to act as currently?
                </div>
                <div className={ commonStyles.gapAbove }>
                    <GroupList groups={ props.groups }/>
                </div>
            </div>;
        } else {
            // This is a placeholder until we have automatic redirection working
            const url = `/${props.groups[0].id}/`;
            return <span>
                <ButtonLink href={ url }>Next</ButtonLink>
            </span>;
        }
    }
}

export const ChooseGroupContent = connectToStores(ChooseGroupContentComponent);