import * as React from "react";
import {connectToStores} from "../../../../shared/alt";
import {ModellingGroup, Responsibility, Scenario, Touchstone} from "../../../../shared/models/Generated";
import {RemoteContent} from "../../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {responsibilityStore} from "../../../stores/ResponsibilityStore";
import {TemplateLink} from "../Overview/List/TemplateLinks";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";
import {CurrentEstimateSetSummary} from "../Overview/List/CurrentEstimateSetSummary";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import {helpers} from "../../../../shared/Helpers";

const commonStyles = require("../../../../shared/styles/common.css");

export interface UploadBurdenEstimatesContentComponentProps extends RemoteContent {
    props: {
        touchstone: Touchstone;
        scenario: Scenario;
        group: ModellingGroup;
        responsibilitySetStatus: string;
        estimatesToken: string;
        responsibility: Responsibility;
    };
}

export class UploadBurdenEstimatesContentComponent extends RemoteContentComponent<UploadBurdenEstimatesContentComponentProps, undefined> {

    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): UploadBurdenEstimatesContentComponentProps {

        const state = responsibilityStore.getState();
        const r = state.currentResponsibility;

        if (r != null && state.estimatesOneTimeToken != null) {
            return {
                ready: state.ready,
                props: {
                    touchstone: state.currentTouchstone,
                    scenario: r.scenario,
                    group: state.currentModellingGroup,
                    responsibility: r,
                    estimatesToken: state.estimatesOneTimeToken,
                    responsibilitySetStatus: responsibilityStore.getCurrentResponsibilitySet().status
                }
            };
        } else {
            return {
                ready: false,
                props: null
            };
        }
    }

    renderContent(props: UploadBurdenEstimatesContentComponentProps) {
        const data = props.props;

        const canCreate = data.responsibilitySetStatus == "incomplete";

        const canUpload = canCreate && data.responsibility.current_estimate_set
            && data.responsibility.current_estimate_set .status == "empty";

        const uploadForm = canUpload ?
            <UploadFileForm token={data.estimatesToken} enableSubmit={true} uploadText={"Upload estimates for this set"}
                            successMessage={"Success! You have uploaded a new set of burden estimates"}/>
            : null;

        const createForm = canCreate && !canUpload  ?
            <CreateBurdenEstimateSetForm groupId={data.group.id}
                                         touchstoneId={data.touchstone.id}
                                         scenarioId={data.scenario.id}/>
            : null;

        return <div>
            <p>
                On this page you can upload burden estimates for the following scenario. We expect estimates which
                cover 96 countries, 100 years, and 100 age bands to take around 1 minute to process. So don't worry if
                it takes a little while!
            </p>
            <table className={commonStyles.specialColumn}>
                <tbody>
                <tr>
                    <td>Touchstone</td>
                    <td>{data.touchstone.description}</td>
                </tr>
                <tr>
                    <td>Scenario</td>
                    <td>{data.scenario.description}</td>
                </tr>
                <tr>
                    <td>Burden estimates template</td>
                    <td><TemplateLink diseaseId={data.scenario.disease} groupId={data.group.id}/></td>
                </tr>
                </tbody>
            </table>

            <div className="mt-3">
                <CurrentEstimateSetSummary estimateSet={data.responsibility.current_estimate_set}
                                           canUpload={canCreate}/>

                {createForm}
                {uploadForm}
            </div>
        </div>;
    }
}

export const UploadBurdenEstimatesContent = connectToStores(UploadBurdenEstimatesContentComponent);