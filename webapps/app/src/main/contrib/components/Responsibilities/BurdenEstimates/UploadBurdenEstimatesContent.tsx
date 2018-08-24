import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {connect} from 'react-redux';

import {ModellingGroup, Responsibility, Scenario, TouchstoneVersion} from "../../../../shared/models/Generated";
import {TemplateLink} from "../Overview/List/OldStyleTemplates/TemplateLink";
import {CurrentEstimateSetSummary} from "../Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "./UploadBurdenEstimatesForm";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {isNullOrUndefined} from "util";
import {settings} from "../../../../shared/Settings";
import {InternalLink} from "../../../../shared/components/InternalLink";

export interface UploadBurdenEstimatesContentProps {
    touchstone: TouchstoneVersion;
    scenario: Scenario;
    group: ModellingGroup;
    responsibilitySetStatus: string;
    responsibility: Responsibility;
    canCreate: boolean;
    canUpload: boolean;
}

export class UploadBurdenEstimatesContentComponent extends React.Component<UploadBurdenEstimatesContentProps> {
    render() {
        const newTemplatesUrl = `/${this.props.group.id}/responsibilities/${this.props.touchstone.id}/templates/`;

        return <div>
            <p>
                On this page you can upload burden estimates for the following scenario. We expect estimates which
                cover 98 countries, 100 years, and 100 age bands to take around 1 minute to process. So don't worry if
                it takes a little while!
            </p>
            <p>Before uploading central burden estimates,
                you will need to register how these were calculated.
            </p>
            <table className="specialColumn">
                <tbody>
                <tr>
                    <td>Touchstone</td>
                    <td>{this.props.touchstone.description}</td>
                </tr>
                <tr>
                    <td>Scenario</td>
                    <td>{this.props.scenario.description}</td>
                </tr>
                <tr>
                    <td>Burden estimates template</td>
                    <td>
                        {settings.showOldTemplates &&
                        <TemplateLink
                            diseaseId={this.props.scenario.disease}
                            groupId={this.props.group.id}
                            touchstoneId={this.props.touchstone.id}
                        />}
                        {settings.showNewTemplates &&
                        <InternalLink href={newTemplatesUrl}>Download templates</InternalLink> }
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="mt-3">
                <CurrentEstimateSetSummary
                    estimateSet={this.props.responsibility.current_estimate_set}
                    canUpload={this.props.canCreate}
                />

                <UploadBurdenEstimatesForm
                    canUpload={this.props.canUpload}
                    canCreate={this.props.canCreate}
                    groupId={this.props.group.id}
                    touchstoneId={this.props.touchstone.id}
                    scenarioId={this.props.scenario.id}
                    estimateSet={this.props.responsibility.current_estimate_set}
                />
            </div>
        </div>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<UploadBurdenEstimatesContentProps> => {
    const newProps = {
        touchstone: state.touchstones.currentTouchstoneVersion,
        scenario: state.responsibilities.currentResponsibility ? state.responsibilities.currentResponsibility.scenario : null,
        group: state.groups.currentUserGroup,
        responsibilitySetStatus: state.responsibilities.responsibilitiesSet ? state.responsibilities.responsibilitiesSet.status : null,
        responsibility: state.responsibilities.currentResponsibility,
        canCreate: false,
        canUpload: false
    };
    newProps.canCreate = newProps.responsibilitySetStatus === "incomplete";
    newProps.canUpload = newProps.canCreate && newProps.responsibility && newProps.responsibility.current_estimate_set != null
        && newProps.responsibility.current_estimate_set.status == "empty";
    return newProps;
};

function notReady(props: UploadBurdenEstimatesContentProps): boolean {
    return isNullOrUndefined(props.responsibility);
}

export const UploadBurdenEstimatesContent = compose(
    connect(mapStateToProps, (dispatch, props) => props),
    branch(notReady, renderComponent(LoadingElement))
)(UploadBurdenEstimatesContentComponent) as React.ComponentClass<Partial<UploadBurdenEstimatesContentProps>>;
