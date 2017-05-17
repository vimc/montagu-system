import * as React from "react";
import { RemoteContentComponent } from "../RemoteContentComponent/RemoteContentComponent";
import { Link } from "simple-react-router";
import { connectToStores } from "../../alt";
import * as ResponsibilityStore from "../../stores/ResponsibilityStore";
import { Touchstone } from "../../Models";
import { RemoteContent } from "../../stores/RemoteContent";

const commonStyles = require("../../styles/common.css");
const styles = require("./TouchstoneList.css");

export interface TouchstoneListProps extends RemoteContent {
    touchstones: Touchstone[];
}

export class TouchstoneLink extends React.Component<Touchstone, undefined> {
    render() {
        return <Link href={ `/responsibilities/${this.props.id}/` }>
            { this.props.description }
        </Link>
    }
}

export class TouchstoneListComponent extends RemoteContentComponent<TouchstoneListProps> {
    static getStores() {
        return [ ResponsibilityStore.Store ];
    }

    static getPropsFromStores(): TouchstoneListProps {
        const state = ResponsibilityStore.Store.getState();
        return {
            touchstones: state.touchstones,
            ready: state.ready
        };
    }

    renderFinished(content: TouchstoneListProps): JSX.Element {
        const finished = content.touchstones.filter(x => x.status != "open");
        if (finished.length > 0) {
            const items = finished.map((touchstone: Touchstone) =>
                <li key={ touchstone.id}>
                    <TouchstoneLink { ...touchstone } />
                </li>
            );
            return <div>{ items }</div>
        } else {
            return <div>There are no past touchstones.</div>
        }
    }

    renderOpen(content: TouchstoneListProps): JSX.Element {
        const open = content.touchstones.find(x => x.status == "open");
        if (open) {
            return <TouchstoneLink { ...open } />
        } else {
            return <div>There is no open touchstone currently.</div>
        }
    }

    renderContent(content: TouchstoneListProps): JSX.Element {
        return <div>
            <div className={ styles.openTouchstone }>
                <div className={ commonStyles.sectionTitle }>Open touchstone</div>
                <div>{ this.renderOpen(content) }</div>
            </div>
            <div className={ styles.finishedTouchstones }>
                <div className={ commonStyles.sectionTitle }>Past finished touchstones</div>
                <div>{ this.renderFinished(content) }</div>
            </div>
        </div>;
    }
}

export const TouchstoneList = connectToStores(TouchstoneListComponent);