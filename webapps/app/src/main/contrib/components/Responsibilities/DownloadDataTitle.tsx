import * as React from "react";
import { InternalLink } from "../../../shared/components/InternalLink";
import { ModellingGroup, Touchstone } from "../../../shared/models/Generated";
import { responsibilityStore } from "../../stores/ResponsibilityStore";
import { connectToStores } from "../../../shared/alt";

import * as headerStyles from '../../../shared/components/PageWithHeader/PageWithHeader.scss';

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
        if (this.props.touchstone && this.props.modellingGroup) {
            const url = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/`;
            return <div className={ `${headerStyles.titleAddition} d-inline-block` }>
                <InternalLink href={ url }>Return to responsibilities list</InternalLink>
            </div>;
        } else {
            return null;
        }
    }

    render() {
        return <div>
            <div className="mr-3 d-inline-block">
            { this.props.title }
            </div>
            { this.renderReturnLink() }
        </div>;
    }
}
export const DownloadDataTitle =
    connectToStores(DownloadDataTitleComponent) as ComponentConstructor<PublicProps, undefined>;