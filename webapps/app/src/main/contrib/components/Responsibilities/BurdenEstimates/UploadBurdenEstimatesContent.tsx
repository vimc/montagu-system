import * as React from "react";
import {connectToStores} from "../../../../shared/alt";
import {ModellingGroup, Responsibility, Scenario, Touchstone} from "../../../../shared/models/Generated";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {TemplateLink} from "../Overview/List/TemplateLinks";
import {CurrentEstimateSetSummary} from "../Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "./UploadBurdenEstimatesForm";

import "../../../../shared/styles/common.scss";

export interface UploadBurdenEstimatesContentComponentProps extends RemoteContent {
    touchstone: Touchstone;
    scenario: Scenario;
    group: ModellingGroup;
    responsibilitySetStatus: string;
    estimatesToken: string;
    responsibility: Responsibility;
}

export class UploadBurdenEstimatesContentComponent extends RemoteContentComponent<UploadBurdenEstimatesContentComponentProps, undefined> {

    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): UploadBurdenEstimatesContentComponentProps {

        const state = responsibilityStore.getState();
        const r = state.currentResponsibility;

        if (r != null) {
            return {
                ready: state.ready,
                touchstone: state.currentTouchstone,
                scenario: r.scenario,
                group: state.currentModellingGroup,
                responsibility: r,
                estimatesToken: state.estimatesOneTimeToken,
                responsibilitySetStatus: responsibilityStore.getCurrentResponsibilitySet().status

            };
        } else {
            return {
                ready: false,
                touchstone: null,
                scenario: null,
                group: null,
                responsibility: null,
                estimatesToken: null,
                responsibilitySetStatus: null
            };
        }
    }

    renderContent(props: UploadBurdenEstimatesContentComponentProps) {

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
                                           estimatesToken={this.props.estimatesToken}
                                           touchstoneId={this.props.touchstone.id}
                                           scenarioId={this.props.scenario.id}/>
            </div>
        </div>;
    }
}

export const UploadBurdenEstimatesContent = connectToStores(UploadBurdenEstimatesContentComponent);