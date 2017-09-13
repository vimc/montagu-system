import * as React from "react";
import { DiseaseFilter } from "./DiseaseFilter";
import { ResponsibilityComponent } from "./ResponsibilityComponent";
import { IExtendedResponsibilitySet } from "../../../../models/ResponsibilitySet";
import { ModellingGroup, Responsibility } from "../../../../../shared/models/Generated";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";
import { TemplateLinks } from "./TemplateLinks";

const styles = require("../../Responsibilities.css");
const messageStyles = require("../../../../../shared/styles/messages.css");
const commonStyles = require("../../../../../shared/styles/common.css");

export interface ResponsibilityListComponentProps {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export class ResponsibilityList extends React.Component<ResponsibilityListComponentProps, undefined> {
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

    render(): JSX.Element {
        const props = this.props;
        const reps = this.getResponsibilities(props);
        if (reps.length) {
            const items = reps.map((item: Responsibility) =>
                <ResponsibilityComponent
                    key={ item.scenario.id }
                    responsibility={ item }
                    touchstone={ props.responsibilitySet.touchstone }
                    modellingGroup={ props.modellingGroup }
                    responsibilitySetStatus={props.responsibilitySet.status}
                />
            );
            return <div>
                <div className={ commonStyles.control }>
                    <DiseaseFilter { ...props.responsibilitySet } />
                    <TemplateLinks responsibilities={props.responsibilitySet.responsibilities } groupId={props.modellingGroup.id} />
                </div>
                <ul className={ styles.responsibilities }>{ items }</ul>
            </div>;
        } else {
            return <div className={ messageStyles.message }>This modelling group has no responsibilities in this
                touchstone</div>
        }
    }
}