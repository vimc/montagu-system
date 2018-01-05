import * as React from "react";
import { DiseaseFilter } from "./DiseaseFilter";
import { ResponsibilityComponent } from "./ResponsibilityComponent";
import { IExtendedResponsibilitySet } from "../../../../models/ResponsibilitySet";
import { ModellingGroup, Responsibility } from "../../../../../shared/models/Generated";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";
import { TemplateLinks } from "./TemplateLinks";

import "../../Responsibilities.scss";
import "../../../../../shared/styles/messages.scss";
import "../../../../../shared/styles/common.scss";
import {InternalLink} from "../../../../../shared/components/InternalLink";

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
                <div className="control mb-4">
                    <DiseaseFilter { ...props.responsibilitySet } />
                    <TemplateLinks
                        responsibilities={props.responsibilitySet.responsibilities }
                        groupId={props.modellingGroup.id}
                        touchstoneId={props.responsibilitySet.touchstone.id}
                    />
                </div>
                <ul className="responsibilities">{ items }</ul>
            </div>;
        } else {
            return <div className="message">This modelling group has no responsibilities in this
                touchstone</div>
        }
    }
}