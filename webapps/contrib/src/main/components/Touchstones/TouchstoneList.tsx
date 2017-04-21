import * as React from "react";
import { RemoteContentComponent } from '../RemoteContentComponent/RemoteContentComponent';
import { RemoteContent }  from '../../stores/RemoteContent';
import { Link } from "simple-react-router";
import { connectToStores } from '../../alt';
import { State, Store } from '../../stores/TouchstoneStore';
import { Touchstone } from '../../Models'
import { touchstoneActions } from '../../actions/TouchstoneActions';

const messageStyles = require("../../styles/messages.css");

export class TouchstoneListComponent extends RemoteContentComponent<State> {
    static getStores() {
        touchstoneActions.fetch();
        return [ Store ];
    }
    static getPropsFromStores(props: State): State {
        return Store.getState();
    }

    renderContent(content: State): JSX.Element {
        if (content.touchstones.length > 0) {
            const items = content.touchstones.map((touchstone: Touchstone) => 
                <li key={ touchstone.id}>
                    <Link href={ `/responsibilities/${touchstone.id}/` }>{ touchstone.description }</Link>
                </li>
            );
            return <ul>{ items }</ul>;
        } else {
            return <div className={ messageStyles.message }>There are no touchstones currently.</div>;
        }
    }
}

export const TouchstoneList = connectToStores(TouchstoneListComponent);