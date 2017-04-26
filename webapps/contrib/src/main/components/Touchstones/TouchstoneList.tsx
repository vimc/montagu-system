import * as React from "react";
import { RemoteContentComponent } from '../RemoteContentComponent/RemoteContentComponent';
import { RemoteContent }  from '../../stores/RemoteContent';
import { Link } from "simple-react-router";
import { connectToStores } from '../../alt';
import { State, Store } from '../../stores/TouchstoneStore';
import { Touchstone } from '../../Models'
import { touchstoneActions } from '../../actions/TouchstoneActions';

const messageStyles = require("../../styles/messages.css");
const commonStyles = require("../../styles/common.css");
const styles = require("./TouchstoneList.css");

export class TouchstoneLink extends React.Component<Touchstone, undefined> {
    render() {
        return <Link href={ `/responsibilities/${this.props.id}/` }>{ this.props.description }</Link>
    }
}

export class TouchstoneListComponent extends RemoteContentComponent<State> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores(props: State): State {
        return Store.getState();
    }

    renderFinished(content: State): JSX.Element {
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

    renderOpen(content: State): JSX.Element {
        const open = content.touchstones.find(x => x.status == "open");
        if (open) {
            return <TouchstoneLink { ...open } />
        } else {
            return <div>There is no open touchstone currently.</div>
        }
    }

    renderContent(content: State): JSX.Element {
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