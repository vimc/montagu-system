import * as React from 'react';
import { RemoteContentComponent } from '../RemoteContentComponent/RemoteContentComponent';
import { DiseaseFilter } from './DiseaseFilter';
import { ResponsibilityComponent } from './ResponsibilityComponent';
import { State, Store } from '../../stores/ResponsibilityStore';
import { Responsibilities, Responsibility } from '../../Models';
import { connectToStores } from '../../alt';

const styles = require("./Responsibilities.css");
const messageStyles = require("../../styles/messages.css");
const commonStyles = require("../../styles/common.css");

export class ResponsibilityListComponent extends RemoteContentComponent<State> {
    static getStores() {
        return [ Store ];
    }
    static getPropsFromStores() {
        return Store.getState();
    }

    getResponsibilities(store: State): Responsibility[] {
        const set: Responsibilities = store.responsibilitySet;
        let reps = set.responsibilities;
        if (store.currentDiseaseId) {
            reps = reps.filter(r => r.scenario.disease == store.currentDiseaseId);
        }
        return reps;
    }

    renderContent(store: State): JSX.Element {
        const reps = this.getResponsibilities(store);
        if (reps.length) {
            const items = reps.map((item: Responsibility) => 
                <ResponsibilityComponent key={ item.scenario.id } {...item} />
            );
            return <div>
                <div className={ commonStyles.control }>
                    <DiseaseFilter { ...this.props.responsibilitySet } />
                </div>
                <ul className={ styles.responsibilities }>{ items }</ul>
            </div>;
        } else {
            return <div className={ messageStyles.message }>This modelling group has no responsibilities in this touchstone</div>
        }
    }
}

export const ResponsibilityList = connectToStores(ResponsibilityListComponent);