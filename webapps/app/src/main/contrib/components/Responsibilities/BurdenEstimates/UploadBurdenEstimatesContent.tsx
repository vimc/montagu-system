import * as React from "react";
import {branch, compose, renderComponent} from "recompose";
import {connect} from 'react-redux';

import {ModellingGroup, Responsibility, Scenario, TouchstoneVersion} from "../../../../shared/models/Generated";
import {CurrentEstimateSetSummary} from "../Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "./UploadBurdenEstimatesForm";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {isNullOrUndefined} from "util";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {Col, Row} from "reactstrap";
import {DiagnosticSection} from "./DiagnosticSection";

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
        const templatesUrl = `/${this.props.group.id}/responsibilities/${this.props.touchstone.id}/templates/`;

        return <div>
            <h5>You are uploading central estimates for
                <span style={{fontWeight: "bold"}}>&nbsp;{this.props.touchstone.description}&nbsp;</span>
                for the
                <span style={{fontWeight: "bold"}}>&nbsp;{this.props.scenario.description}&nbsp;</span>
                scenario</h5>
            <InternalLink href={templatesUrl}>Download templates</InternalLink>
            <p className="my-3">
                Please note we expect estimates for 98 countries, 100 ages and 100 years to take over a minute to process.
                So don't worry if it takes a little while!
            </p>
            <Row>
                <Col>
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
                </Col>
            </Row>
            {this.props.responsibility.current_estimate_set &&
            <DiagnosticSection setId={this.props.responsibility.current_estimate_set.id}
                               scenarioId={this.props.scenario.id}/>}
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