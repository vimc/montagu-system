import * as React from "react";
import { Component } from "react";
import { settings } from "../../../../shared/Settings";
import { RemoteContentComponent } from "../../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import { InternalLink } from "../../../../shared/components/InternalLink";

import "../../../../shared/styles/common.scss";
import "../../../../shared/styles/messages.scss";

export class ResponsibilityOverviewDescriptionComponent extends Component {
    render() {
        const guidanceInputsUrl = `/help/model-inputs/`;
        const guidanceOutputsUrl = `/help/model-outputs/`;
        return <div>
            On this page you can:
            <ul>
                <li>
                    See an overview of which scenarios your group is responsible
                    for providing burden estimates for.
                </li>
                <li>
                    Download vaccination coverage data for each scenario.&nbsp;
                    <InternalLink href={guidanceInputsUrl}>
                        More guidance here
                    </InternalLink>.
                </li>
                <li>
                    Download demographic data which applies to all scenarios.
                    Please use the demographic datasets supplied to ensure consistency
                    between all models.&nbsp;
                    <InternalLink href={`${guidanceInputsUrl}#demography`}>
                        More guidance here
                    </InternalLink>.
                </li>
                <li>
                    Download csv templates for central and stochastic burden estimates,
                    and for underlying parameter values.
                </li>
                <li>
                    Upload central burden estimates for each scenario, and review any
                    problems the system has detected in the uploaded data.&nbsp;
                    <InternalLink href={guidanceOutputsUrl}>
                        More guidance here
                    </InternalLink>.
                </li>
                <li>
                    Upload your parameters file.&nbsp;
                    <InternalLink href={guidanceOutputsUrl}>
                        More guidance here
                    </InternalLink>.
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
                    <InternalLink href={guidanceInputsUrl}>
                        Guidance on model inputs: coverage and demographic data
                    </InternalLink>
                </li>
                <li>
                    <InternalLink href={guidanceOutputsUrl}>
                        Guidance on model outputs: how to generate and upload central
                        and stochastic estimates
                    </InternalLink>
                </li>
            </ul>
            <span>
                If you have any questions or anything is not as you expected,
                please email&nbsp;
                <a href={`mailto:${settings.supportContact}`}>
                    {settings.supportContact}
                </a>
                &nbsp;or use the #montagu-help
                channel on&nbsp;
                <a href={settings.slackUrl} target="_blank">
                    Slack
                </a>.
            </span>
        </div>
    }
}

export const ResponsibilityOverviewDescription = ResponsibilityOverviewDescriptionComponent;