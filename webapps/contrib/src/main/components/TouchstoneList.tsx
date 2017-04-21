import * as React from "react";
import { RemoteContentComponent } from './RemoteContentComponent';
import { RemoteContent }  from '../stores/RemoteContent';
import { Link } from "simple-react-router";
import { connectToStores } from '../alt';
import { State, Store } from '../stores/TouchstoneStore';
import { Touchstone } from '../Models'
import { touchstoneActions } from '../actions/TouchstoneActions';

class TouchstoneListComponent extends RemoteContentComponent<State> {
    static getStores() {
        touchstoneActions.fetch();
        return [ Store ];
    }
    static getPropsFromStores(props: State): State {
        return Store.getState();
    }

    renderContent(content: State): JSX.Element {
        const items = content.touchstones.map((touchstone: Touchstone) => 
            <li key={ touchstone.id}>
                <Link href={ `/responsibilities/${touchstone.id}` }>{ touchstone.description }</Link>
            </li>
        );
        return <ul>{ items }</ul>;
    }
}

export const TouchstoneList = connectToStores(TouchstoneListComponent);