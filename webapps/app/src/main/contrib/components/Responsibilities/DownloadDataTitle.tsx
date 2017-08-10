import * as React from "react";
import { InternalLink } from "../../../shared/components/InternalLink";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { connectToStores } from "../../../shared/alt";

const headerStyles = require("../../../shared/components/PageWithHeader/PageWithHeader.css");


interface PublicProps {
    title: string;
}
interface Props extends PublicProps {
    touchstone: Touchstone;
    modellingGroup: ModellingGroup;
}

export class DownloadDataTitleComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [ responsibilityStore ];
    }
    static getPropsFromStores(props: Props): Props {
        const state = responsibilityStore.getState();
        return {
            title: props.title,
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
            { this.props.title }
            { this.renderReturnLink() }
        </span>;
    }
}
export const DownloadDataTitle =
    connectToStores(DownloadDataTitleComponent) as ComponentConstructor<PublicProps, undefined>;