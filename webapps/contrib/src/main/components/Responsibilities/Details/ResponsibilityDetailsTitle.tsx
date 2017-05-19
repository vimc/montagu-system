import * as React from "react";
import { connectToStores } from "../../../alt";
import { Touchstone } from "../../../models/Generated";
import * as ResponsibilityStore from "../../../stores/ResponsibilityStore";
import { RemoteContent } from "../../../stores/RemoteContent";
import { RemoteContentComponent } from "../../RemoteContentComponent/RemoteContentComponent";
import { Link } from "simple-react-router";

const headerStyles = require("../../PageWithHeader/PageWithHeader.css");

interface Props extends RemoteContent {
    touchstone: Touchstone;
}

export class ResponsibilityDetailsTitleComponent extends RemoteContentComponent<Props> {
    static getStores() {
        return [ ResponsibilityStore.Store ];
    }
    static getPropsFromStores() {
        const state = ResponsibilityStore.Store.getState();
        return {
            touchstone: state.currentTouchstone,
            ready: state.currentTouchstone && state.currentResponsibility
        };
    }

    renderContent(props: Props) {
        const url = `/responsibilities/${props.touchstone.id}/`;
        return <span>
            Download coverage data
            <span className={ headerStyles.titleAddition }>
                <Link href={ url }>Return to responsibilities list</Link>
            </span>
        </span>;
    }
}
export const ResponsibilityDetailsTitle = connectToStores(ResponsibilityDetailsTitleComponent);