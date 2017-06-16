import * as React from "react";
import { connectToStores } from "../../../../shared/alt";
import { ModellingGroup, Touchstone } from "../../../models/Generated";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { InternalLink } from "../../../../shared/components/InternalLink";

const headerStyles = require("../../../../shared/components/PageWithHeader/PageWithHeader.css");

interface Props {
    touchstone: Touchstone;
    modellingGroup: ModellingGroup;
}

export class DownloadCoverageTitleComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [ responsibilityStore ];
    }
    static getPropsFromStores() {
        const state = responsibilityStore.getState();
        return {
            touchstone: state.currentTouchstone,
            modellingGroup: state.currentModellingGroup
        };
    }

    renderReturnLink() {
        if (this.props.touchstone) {
            const url = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/`
            return <span className={ headerStyles.titleAddition }>
                <InternalLink href={ url }>Return to responsibilities list</InternalLink>
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
export const DownloadCoverageTitle = connectToStores(DownloadCoverageTitleComponent);