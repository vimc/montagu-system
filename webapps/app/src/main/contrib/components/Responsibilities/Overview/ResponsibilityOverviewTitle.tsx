import * as React from "react";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { Touchstone } from "../../../../shared/models/Generated";
import { connectToStores } from "../../../../shared/alt";

const headerStyles = require("../../../../shared/components/PageWithHeader/PageWithHeader.css");

export class ResponsibilityOverviewTitleComponent extends React.Component<Touchstone, undefined> {
    static getStores() {
        return [ responsibilityStore ];
    }
    static getPropsFromStores() {
        return responsibilityStore.getState().currentTouchstone;
    }

    render() {
        let description = "";
        if (this.props != null) {
            description = this.props.description;
        }
        return <span>
            Responsibilities in { description }
        </span>;
    }
}
export const ResponsibilityOverviewTitle = connectToStores(ResponsibilityOverviewTitleComponent);