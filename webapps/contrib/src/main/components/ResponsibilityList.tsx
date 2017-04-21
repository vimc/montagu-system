import * as React from 'react';
import { RemoteContentComponent } from './RemoteContentComponent';
import { State, Store } from '../stores/ResponsibilityStore';
import { Responsibilities, Responsibility } from '../Models';
import { connectToStores } from '../alt';

const spinner = require("../resources/spinner.gif");
const styles = require("../styles/responsibilities.css");

class ResponsibilityListComponent extends RemoteContentComponent<State> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores() {
        return Store.getState();
    }

    renderContent(store: State): JSX.Element {
        const set: Responsibilities = store.responsibilitySet;
        if (set.responsibilities.length) {
            const items = set.responsibilities.map((item: Responsibility) => 
                <ResponsibilityComponent key={ item.scenario.id } {...item} />
            );
            return <div>
                <ul className={ styles.responsibilities }>{ items }</ul>
            </div>
        } else {
            return <div className={ styles.message }>This modelling group has no responsibilities in the current touchstone</div>                
        }
    }
}

class ResponsibilityComponent extends React.Component<Responsibility, undefined> {
    render() {
        const item = this.props;
        return <li className={ styles.scenario }>
            <div className={ styles.header }>
                <span className={ styles.name }>{ item.scenario.description }</span>
                &nbsp;
                (ID: { item.scenario.id })
                <span className={ styles.status }>{ item.status }</span>
            </div>
            <div>
                <div className={ styles.content }>
                    <div className={ styles.actions }>
                        <button>Download input data</button>
                        <button>Upload a new burden estimate set</button>
                    </div>
                    <div className={ styles.estimates }>
                        You have not uploaded any burden estimate sets.
                    </div>
                </div>
            </div>
        </li>
    }
}

export const ResponsibilityList = connectToStores(ResponsibilityListComponent);