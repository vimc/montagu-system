import * as React from "react";
import { Action, Dispatch } from "redux";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';

import {ModellingGroup, Responsibility, Scenario, Touchstone} from "../../../../shared/models/Generated";
import {TemplateLink} from "../Overview/List/TemplateLinks";
import {CurrentEstimateSetSummary} from "../Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "./UploadBurdenEstimatesForm";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";

export interface UploadBurdenEstimatesContentProps {
    touchstone: Touchstone;
    scenario: Scenario;
    group: ModellingGroup;
    responsibilitySetStatus: string;
    token: string;
    responsibility: Responsibility;
}

export class UploadBurdenEstimatesContentComponent extends React.Component<UploadBurdenEstimatesContentProps> {

    render() {

        const canCreate = this.props.responsibilitySetStatus == "incomplete";

        const canUpload = canCreate && this.props.responsibility.current_estimate_set != null
            && this.props.responsibility.current_estimate_set.status == "empty";

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
                        <TemplateLink
                            diseaseId={this.props.scenario.disease}
                            groupId={this.props.group.id}
                            touchstoneId={this.props.touchstone.id}
                        />
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="mt-3">
                <CurrentEstimateSetSummary estimateSet={this.props.responsibility.current_estimate_set}
                                           canUpload={canCreate}/>

                <UploadBurdenEstimatesForm canUpload={canUpload} canCreate={canCreate} groupId={this.props.group.id}
                                           estimatesToken={this.props.token}
                                           touchstoneId={this.props.touchstone.id}
                                           scenarioId={this.props.scenario.id}/>
            </div>
        </div>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<UploadBurdenEstimatesContentProps> => {
    return {
        touchstone: state.touchstones.currentTouchstone,
        scenario: state.responsibilities.currentResponsibility ? state.responsibilities.currentResponsibility.scenario : null,
        group: state.groups.currentUserGroup,
        responsibilitySetStatus: state.responsibilities.set ? state.responsibilities.set.status : null,
        token: state.estimates.token,
        responsibility: state.responsibilities.currentResponsibility
    }
};

export const UploadBurdenEstimatesContent = compose(
    connect(mapStateToProps, ),
    branch((props: UploadBurdenEstimatesContentProps) => !props.responsibility, renderComponent(LoadingElement))
)(UploadBurdenEstimatesContentComponent) as React.ComponentClass<Partial<UploadBurdenEstimatesContentProps>>;
