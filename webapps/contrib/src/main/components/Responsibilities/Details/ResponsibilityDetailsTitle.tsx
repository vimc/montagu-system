import * as React from "react";
import { connectToStores } from "../../../alt";
import { Touchstone } from "../../../models/Generated";
import { Link } from "simple-react-router";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";

const headerStyles = require("../../PageWithHeader/PageWithHeader.css");

interface Props {
    touchstone: Touchstone;
}

export class ResponsibilityDetailsTitleComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [ responsibilityStore ];
    }
    static getPropsFromStores() {
        const state = responsibilityStore.getState();
        return { touchstone: state.currentTouchstone };
    }

    renderReturnLink() {
        if (this.props.touchstone) {
            const url = `/responsibilities/${this.props.touchstone.id}/`
            return <span className={ headerStyles.titleAddition }>
                <Link href={ url }>Return to responsibilities list</Link>
            </span>;
        } else {
            return null;
        }
    }

    render() {
        return <span>
            Download coverage data
            { this.renderReturnLink() }
        </span>;
    }
}
export const ResponsibilityDetailsTitle = connectToStores(ResponsibilityDetailsTitleComponent);