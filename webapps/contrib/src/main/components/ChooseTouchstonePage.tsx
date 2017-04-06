import * as React from "react";
import { Link } from "simple-react-router";
import { connectToStores } from '../alt';
import { State, Store, Touchstone } from '../stores/TouchstoneStore';
import { PageWithHeader } from './PageWithHeader';
import { touchstoneActions } from '../actions/TouchstoneActions';

const spinner = require("../resources/spinner.gif");

class TouchstoneList extends React.Component<State, undefined> {
    static getStores() {
        touchstoneActions.fetch();
        return [ Store ];
    }
    static getPropsFromStores(props: State): State {
        return Store.getState();
    }

    render() {
        if (this.props.touchstones) {
            const items = this.props.touchstones.map((touchstone: Touchstone) => 
                <li key={ touchstone.id}>
                    <Link href={ `/responsibilities/${touchstone.id}` }>{ touchstone.description }</Link>
                </li>
            );
            return <ul>{ items }</ul>;
        } else if (this.props.errorMessage) {
            return <div>{ this.props.errorMessage }</div>
        } else {
            return <img src={ spinner } />
        }
    }
}

const TouchstoneList_Connected = connectToStores(TouchstoneList);

export class ChooseTouchstonePage extends PageWithHeader<undefined, undefined> {
    title() { return <span>Choose a touchstone</span>; }

    renderPageContent() {
        return <TouchstoneList_Connected />;
    }
}