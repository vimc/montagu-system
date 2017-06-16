import * as React from "react";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { connectToStores } from "../../../shared/alt";
import { TouchstoneList } from "./TouchstoneList";
import { RemoteContent } from "../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../RemoteContentComponent/RemoteContentComponent";
import { GroupList } from "./GroupList";
import { ButtonLink } from "../../../shared/components/ButtonLink";

const commonStyles = require("../../../shared/styles/common.css");

export interface GroupAndTouchstoneChoiceProps extends RemoteContent {
    groups: ModellingGroup[],
    chosenGroup: ModellingGroup,
    touchstones: Touchstone[],
    chosenTouchstone: Touchstone,
}

export class GroupAndTouchstoneChoiceComponent extends RemoteContentComponent<GroupAndTouchstoneChoiceProps> {
    static getStores() {
        return [ responsibilityStore, contribAuthStore ];
    }
    static getPropsFromStores() {
        const res = responsibilityStore.getState();
        return {
            groups: contribAuthStore.getState().modellingGroups,
            chosenGroup: res.currentModellingGroup,
            touchstones: res.touchstones,
            chosenTouchstone: res.currentTouchstone,
            ready: res.ready
        };
    }

    renderGroupChoice(props: GroupAndTouchstoneChoiceProps): JSX.Element {
        if (props.groups && props.groups.length > 1) {
            return <div>
                <div className={ commonStyles.sectionTitle }>Modelling group</div>
                <div>
                    You are a member of multiple modelling groups.
                    Which one do you want to view responsibilities for?
                </div>
                <div className={ commonStyles.gapAbove }>
                    <GroupList groups={ props.groups }
                               selected={ props.chosenGroup }
                               ready={ props.ready } />
                </div>
            </div>
        } else {
            return null;
        }
    }

    renderTouchstoneChoice(props: GroupAndTouchstoneChoiceProps): JSX.Element {
        return <div>
            <div className={ commonStyles.sectionTitle }>Touchstone</div>
            <div>
                Which touchstone do you want to view responsibilities for? You can select either the current
                open touchstone, if there is one, or a past touchstone that is now closed.
            </div>
            <TouchstoneList touchstones={ props.touchstones }
                        selected={ props.chosenTouchstone }
                        ready={ props.ready } />
        </div>;
    }

    renderContent(props: GroupAndTouchstoneChoiceProps) {
        const buttonEnabled = props.chosenGroup != null && props.chosenTouchstone != null;
        let href = null;
        if (buttonEnabled) {
            href = `/${props.chosenGroup.id}/responsibilities/${props.chosenTouchstone.id}/`;
        }
        return <div>
            { this.renderGroupChoice(props) }
            { this.renderTouchstoneChoice(props) }
            <div className={ commonStyles.sectionTitle }>View responsibilities</div>
            <div className={ commonStyles.gapAbove }>
                <ButtonLink href={ href } disabled={ !buttonEnabled }>
                    View responsibilities
                </ButtonLink>
            </div>
        </div>;
    }
}

export const GroupAndTouchstoneChoice = connectToStores(GroupAndTouchstoneChoiceComponent);