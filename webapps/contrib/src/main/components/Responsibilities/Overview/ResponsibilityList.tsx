import * as React from "react";
import { RemoteContentComponent } from "../../RemoteContentComponent/RemoteContentComponent";
import { DiseaseFilter } from "./DiseaseFilter";
import { ResponsibilityComponent } from "./ResponsibilityComponent";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { ModellingGroup, Responsibility } from "../../../models/Generated";
import { connectToStores } from "../../../alt";
import { RemoteContent } from "../../../stores/RemoteContent";
import { IExtendedResponsibilitySet } from "../../../models/ResponsibilitySet";

const styles = require("../Responsibilities.css");
const messageStyles = require("../../../styles/messages.css");
const commonStyles = require("../../../styles/common.css");

export interface ResponsibilityListComponentProps extends RemoteContent {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export class ResponsibilityListComponent extends RemoteContentComponent<ResponsibilityListComponentProps> {
    static getStores() {
        return [ responsibilityStore ];
    }

    static getPropsFromStores(): ResponsibilityListComponentProps {
        const state = responsibilityStore.getState();
        return {
            responsibilitySet: state.responsibilitySet,
            ready: state.ready,
            currentDiseaseId: state.currentDiseaseId,
            modellingGroup: state.currentModellingGroup
        }
    }

    getResponsibilities(props: ResponsibilityListComponentProps): Responsibility[] {
        const set = props.responsibilitySet;
        if (set) {
            let reps = set.responsibilities;
            if (props.currentDiseaseId) {
                reps = reps.filter(r => r.scenario.disease == props.currentDiseaseId);
            }
            return reps;
        } else {
            return [];
        }
    }

    renderContent(props: ResponsibilityListComponentProps): JSX.Element {
        const reps = this.getResponsibilities(props);
        if (reps.length) {
            const items = reps.map((item: Responsibility) =>
                <ResponsibilityComponent
                    key={ item.scenario.id }
                    responsibility={ item }
                    touchstone={ props.responsibilitySet.touchstone }
                    modellingGroup={ props.modellingGroup }
                />
            );
            return <div>
                <div className={ commonStyles.control }>
                    <DiseaseFilter { ...props.responsibilitySet } />
                </div>
                <ul className={ styles.responsibilities }>{ items }</ul>
            </div>;
        } else {
            return <div className={ messageStyles.message }>This modelling group has no responsibilities in this
                touchstone</div>
        }
    }
}

export const ResponsibilityList = connectToStores(ResponsibilityListComponent);