import * as React from "react";
import { connect } from 'react-redux';

import {
    Disease,
    ModellingGroup, Responsibility, ResponsibilitySetStatus,
    Touchstone
} from "../../../../../shared/models/Generated";
import { ButtonLink } from "../../../../../shared/components/ButtonLink";
import {CurrentEstimateSetSummary} from "./CurrentEstimateSetSummary";
import {TemplateLinkComponent, TemplateLinkProps} from "./TemplateLinks";
import {ContribAppState} from "../../../../reducers/contribAppReducers";

export interface ResponsibilityScenarioProps {
    responsibility: Responsibility;
    modellingGroup: ModellingGroup;
    touchstone: Touchstone;
    responsibilitySetStatus: ResponsibilitySetStatus;
    diseases?: Disease[];
}

export class ResponsibilityScenarioComponent extends React.Component<ResponsibilityScenarioProps, undefined> {
    render() {
        const item = this.props.responsibility;
        const downloadUrl = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/coverage/${item.scenario.id}/`;
        const uploadUrl = `/${this.props.modellingGroup.id}/responsibilities/${this.props.touchstone.id}/burdens/${item.scenario.id}/`;
        const canUpload = this.props.responsibilitySetStatus == "incomplete";
        const disease = this.props.diseases.find(disease => disease.id === item.scenario.disease);

        return <li className="scenario">
            <div className="header">
                <span className="name">{item.scenario.description}</span>
                &nbsp;
                (ID: {item.scenario.id})
                <span className="status">{item.status}</span>
                <span className="clearfix"></span>
            </div>
            <div>
                <div className="content">
                    <div className="metadata">
                        Disease: {disease.name}
                    </div>
                    <div className="actions">
                        <ButtonLink href={downloadUrl}>Download coverage data</ButtonLink>
                        <ButtonLink href={uploadUrl}>Upload burden estimates</ButtonLink>
                        <CurrentEstimateSetSummary
                            estimateSet={this.props.responsibility.current_estimate_set}
                            canUpload={canUpload}
                        />
                    </div>
                </div>
            </div>
        </li>
    }
}

const mapStateToProps = (state: ContribAppState, props: ResponsibilityScenarioProps): Partial<ResponsibilityScenarioProps> => {
    return {
        ...props,
        diseases: state.diseases.diseases
    }
}

export const ResponsibilityScenario = connect(mapStateToProps)(ResponsibilityScenarioComponent);