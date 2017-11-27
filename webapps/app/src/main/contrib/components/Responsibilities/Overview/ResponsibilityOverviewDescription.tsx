import * as React from "react";
import { settings } from "../../../../shared/Settings";
import { RemoteContent } from "../../../../shared/models/RemoteContent";
import { IExtendedResponsibilitySet } from "../../../models/ResponsibilitySet";
import { ModellingGroup } from "../../../../shared/models/Generated";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import { ResponsibilityList } from "./List/ResponsibilityList";
import { connectToStores } from "../../../../shared/alt";
import { ButtonLink } from "../../../../shared/components/ButtonLink";

const commonStyles = require("../../../../shared/styles/common.css");
const messageStyles = require("../../../../shared/styles/messages.css");

export interface ResponsibilityOverviewComponentProps extends RemoteContent {
    responsibilitySet: IExtendedResponsibilitySet;
    currentDiseaseId: string;
    modellingGroup: ModellingGroup;
}

export class ResponsibilityOverviewDescriptionComponent extends RemoteContentComponent<ResponsibilityOverviewComponentProps> {
    static getStores() {
        return [responsibilityStore];
    }

    static getPropsFromStores(): ResponsibilityOverviewComponentProps {
        const state = responsibilityStore.getState();
        const set = responsibilityStore.getCurrentResponsibilitySet();
        return {
            responsibilitySet: set,
            ready: state.ready && set != null,
            currentDiseaseId: state.currentDiseaseId,
            modellingGroup: state.currentModellingGroup
        }
    }

    renderContent(props: ResponsibilityOverviewComponentProps) {
        const guidanceInputsUrl = `/help/guidance-model-inputs/`;
        const guidanceOutputsUrl = `/help/guidance-model-outputs/`;
        return <div>
            On this page you can:
            <ul>
                <li>
                    See an overview of which scenarios your group is responsible
                    for providing burden estimates for.
                </li>
                <li>
                    Download vaccination coverage data for each scenario.&nbsp;
                    <a
                        href={guidanceInputsUrl}
                    >
                        More guidance here
                    </a>.
                </li>
                <li>
                    Download demographic data which applies to all scenarios.
                    Please use the demographic datasets supplied to ensure consistency
                    between all models.&nbsp;
                    <a
                        href={`${guidanceInputsUrl}#demography`}
                    >
                        More guidance here
                    </a>.
                </li>
                <li>
                    Download csv templates for central and stochastic burden estimates,
                    and for underlying parameter values.
                </li>
                <li>
                    Upload central burden estimates for each scenario, and review any
                    problems the system has detected in the uploaded data.&nbsp;
                    <a
                        href={guidanceOutputsUrl}
                    >
                        More guidance here
                    </a>.
                </li>
                <li>
                    Upload your parameters file.&nbsp;
                    <a
                        href={guidanceOutputsUrl}
                    >
                        More guidance here
                    </a>.
                </li>
            </ul>
            <p>
                In the future, you will also be able to upload stochastic burden estimates for each
                scenario.
            </p>
            <span>
                Useful links:
            </span>
            <ul>
                <li>
                    <a
                        href={guidanceInputsUrl}
                    >
                        Guidance on model inputs: coverage and demographic data
                    </a>
                </li>
                <li>
                    <a
                        href={guidanceOutputsUrl}
                    >
                        Guidance on model outputs: how to generate and upload central
                        and stochastic estimates
                    </a>
                </li>
            </ul>
            <span>
                If you have any questions or anything is not as you expected,
                please email&nbsp;
                <a
                    href={`mailto:${settings.supportContact}`}
                >
                    {settings.supportContact}
                </a>
                &nbsp;or use the #montagu-help
                channel on&nbsp;
                <a
                    href={settings.slackUrl}
                    target="_blank"
                >
                    Slack
                </a>.
            </span>
        </div>
    }
}

export const ResponsibilityOverviewDescription = connectToStores(ResponsibilityOverviewDescriptionComponent);