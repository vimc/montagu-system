import * as React from "react";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { contribAuthStore } from "../../stores/ContribAuthStore";
import { connectToStores } from "../../../shared/alt";
import { TouchstoneList } from "./TouchstoneList";
import { RemoteContent } from "../../../shared/models/RemoteContent";
import { RemoteContentComponent } from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { isNullOrUndefined } from "util";
import { InternalLink } from "../../../shared/components/InternalLink";

const commonStyles = require("../../../shared/styles/common.css");

export interface ChooseActionContentProps extends RemoteContent {
    touchstones: Touchstone[];
    group: ModellingGroup
}

export class ChooseActionContentComponent extends RemoteContentComponent<ChooseActionContentProps, {}> {
    static getStores() {
        return [ responsibilityStore, contribAuthStore ];
    }
    static getPropsFromStores() {
        const res = responsibilityStore.getState();
        return {
            touchstones: res.touchstones,
            group: res.currentModellingGroup,
            ready: res.ready && !isNullOrUndefined(res.currentModellingGroup)
        };
    }

    renderTouchstoneChoice(props: ChooseActionContentProps): JSX.Element {
        return <div>
            <div className={ commonStyles.sectionTitle }>Your responsibilities</div>
            <p>
                Click on any of the past and open touchstones below to view your
                group's responsibilities in that touchstone and to download
                vaccination coverage and demographic input datasets for each
                responsibility. Additionally, for open touchstones, you will
                be able to upload the estimates associated with each responsibility.
            </p>
            <p>
                <InternalLink href="/help/touchstones/">What is a touchstone?</InternalLink>
            </p>
            <TouchstoneList touchstones={ props.touchstones }
                            group={ props.group }
                            ready={ props.ready } />
        </div>;
    }

    renderContent(props: ChooseActionContentProps) {
        return <div>
            { this.renderTouchstoneChoice(props) }
        </div>;
    }
}

export const ChooseActionContent = connectToStores(ChooseActionContentComponent);