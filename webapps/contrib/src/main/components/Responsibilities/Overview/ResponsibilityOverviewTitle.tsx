import * as React from "react";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { Link } from "simple-react-router";
import { Touchstone } from "../../../models/Generated";
import { connectToStores } from "../../../alt";

const headerStyles = require("../../PageWithHeader/PageWithHeader.css");

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
            <span className={ headerStyles.titleAddition }>
                <Link href="/">Change touchstone</Link>
            </span>
        </span>;
    }
}
export const ResponsibilityOverviewTitle = connectToStores(ResponsibilityOverviewTitleComponent);