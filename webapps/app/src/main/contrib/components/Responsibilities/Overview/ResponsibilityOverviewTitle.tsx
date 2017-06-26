import * as React from "react";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { Touchstone } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";

interface Props {
    touchstone: Touchstone;
}

export class ResponsibilityOverviewTitleComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [ responsibilityStore ];
    }
    static getPropsFromStores(): Props {
        return {
            touchstone: responsibilityStore.getState().currentTouchstone
        };
    }

    render() {
        let description = "";
        if (this.props.touchstone != null) {
            description = this.props.touchstone.description;
        }
        return <span>
            Responsibilities in { description }
        </span>;
    }
}
export const ResponsibilityOverviewTitle = connectToStores(ResponsibilityOverviewTitleComponent);